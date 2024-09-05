import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  Controller,
  Delete,
  Param,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DeleteGroupUseCase } from '@/domain/registrations/application/use-cases/delete-group';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

@Controller('/groups/:groupId')
export class DeleteGroupController {
  constructor(private deleteGroup: DeleteGroupUseCase) {}

  @ApiTags('Groups')
  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiOperation({
    summary: 'Delete a group by ID',
  })
  @HttpCode(204)
  @Delete()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('groupId') groupId: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.deleteGroup.execute({
      subscriptionId: subscription,
      executorId: sub,
      groupId,
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
