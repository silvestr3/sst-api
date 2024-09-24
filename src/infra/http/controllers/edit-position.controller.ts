import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { EditPositionUseCase } from '@/domain/registrations/application/use-cases/edit-position';
import { EditPositionDTO } from '../dto/edit-position.dto';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

@Controller('/positions/:positionId')
export class EditPositionController {
  constructor(private editPosition: EditPositionUseCase) {}

  @ApiTags('Positions')
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'User is not allowed to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Position was not found',
  })
  @ApiOperation({
    summary: 'Edit position',
  })
  @ApiBearerAuth()
  @HttpCode(204)
  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: EditPositionDTO,
    @Param('positionId', new IsValidUUIDPipe('positionId')) positionId: string,
  ) {
    const { description, name, cbo, isActive } = body;
    const { sub, subscription } = user;

    const result = await this.editPosition.execute({
      subscriptionId: subscription,
      executorId: sub,
      positionId,
      name,
      description,
      cbo,
      isActive,
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
  }
}
