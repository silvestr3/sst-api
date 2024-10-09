import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { PositionPresenter } from '../presenters/position-presenter';
import { FetchPositionsByEmployerIdResponse } from '../dto/fetch-positions-by-employer-id.dto';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { UUID } from 'crypto';
import { SearchPositionsByNameUseCase } from '@/domain/registrations/application/use-cases/search-positions-by-name';

@Controller('/positions/search')
export class SearchPositionsByNameController {
  constructor(private searchPositionsByName: SearchPositionsByNameUseCase) {}

  @ApiTags('Positions')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FetchPositionsByEmployerIdResponse,
    description: 'List of positions',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiOperation({
    summary: 'Search positions from subscription by name ',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('employerId', new IsValidUUIDPipe('employerId')) employerId: UUID,
    @Query('q') query: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.searchPositionsByName.execute({
      subscriptionId: subscription,
      executorId: sub,
      searchTerm: query,
      employerId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { positions } = result.value;

    const presenterPositions = positions.map(PositionPresenter.toHttp);

    return { positions: presenterPositions };
  }
}
