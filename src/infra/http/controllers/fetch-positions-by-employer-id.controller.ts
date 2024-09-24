import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { FetchPositionsByEmployerIdUseCase } from '@/domain/registrations/application/use-cases/fetch-positions-by-employer-id';
import { PositionPresenter } from '../presenters/position-presenter';
import { FetchPositionsByEmployerIdResponse } from '../dto/fetch-positions-by-employer-id.dto';

@Controller('/employers/:employerId/positions')
export class FetchPositionsByEmployerIdController {
  constructor(
    private fetchPositionsByEmployerId: FetchPositionsByEmployerIdUseCase,
  ) {}

  @ApiTags('Employers')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FetchPositionsByEmployerIdResponse,
    description: 'List of positions in the employer',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employer was not found',
  })
  @ApiOperation({
    summary: 'List all positions of the employer',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('employerId', new IsValidUUIDPipe('employerId')) employerId: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.fetchPositionsByEmployerId.execute({
      subscriptionId: subscription,
      executorId: sub,
      employerId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { positions } = result.value;

    const presenterPositions = positions.map(PositionPresenter.toHttp);

    return { positions: presenterPositions };
  }
}
