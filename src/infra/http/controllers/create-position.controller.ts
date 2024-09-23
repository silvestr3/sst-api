import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { CreatePositionUseCase } from '@/domain/registrations/application/use-cases/create-position';
import {
  CreatePositionDTO,
  CreatePositionResponse,
} from '../dto/create-position.dto';
import { PositionPresenter } from '../presenters/position-presenter';

@Controller('/employers/:employerId/positions')
export class CreatePositionController {
  constructor(private createPosition: CreatePositionUseCase) {}

  @ApiTags('Employers')
  @ApiCreatedResponse({
    type: CreatePositionResponse,
    description: 'New Position',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not allowed to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employer was not found',
  })
  @ApiOperation({
    summary: 'Create new position',
  })
  @ApiBearerAuth()
  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreatePositionDTO,
    @Param('employerId', new IsValidUUIDPipe('employerId')) employerId: string,
  ) {
    const { description, name, cbo } = body;
    const { sub, subscription } = user;

    const result = await this.createPosition.execute({
      subscriptionId: subscription,
      executorId: sub,
      employerId,
      name,
      description,
      cbo,
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

    const { position } = result.value;

    return { position: PositionPresenter.toHttp(position) };
  }
}
