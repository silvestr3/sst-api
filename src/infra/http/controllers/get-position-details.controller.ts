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
import { GetPositionDetailsUseCase } from '@/domain/registrations/application/use-cases/get-position-details';
import { GetPositionDetailsResponse } from '../dto/get-position-details.dto';
import { PositionDetailsPresenter } from '../presenters/position-details-presenter';

@Controller('/positions/:positionId/details')
export class GetPositionDetailsController {
  constructor(private getPositionDetails: GetPositionDetailsUseCase) {}

  @ApiTags('Positions')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: GetPositionDetailsResponse,
    description: 'Position details',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Position was not found',
  })
  @ApiOperation({
    summary: 'Get position details by id',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('positionId', new IsValidUUIDPipe('positionId'))
    positionId: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.getPositionDetails.execute({
      subscriptionId: subscription,
      executorId: sub,
      positionId,
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

    const { position } = result.value;

    return { position: PositionDetailsPresenter.toHttp(position) };
  }
}
