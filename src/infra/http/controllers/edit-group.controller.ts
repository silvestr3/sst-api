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
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EditGroupUseCase } from '@/domain/registrations/application/use-cases/edit-group';
import { EditGroupDTO } from '../dto/edit-group.dto';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';

@Controller('/groups/:groupId')
export class EditGroupController {
  constructor(private editGroupUseCase: EditGroupUseCase) {}

  @ApiTags('Groups')
  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Group not found',
  })
  @ApiOperation({
    summary: 'Edit a group by ID',
  })
  @HttpCode(204)
  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('groupId', new IsValidUUIDPipe('groupId')) groupId: string,
    @Body() body: EditGroupDTO,
  ) {
    const { name, description, isActive } = body;
    const { sub, subscription } = user;

    const result = await this.editGroupUseCase.execute({
      subscriptionId: subscription,
      executorId: sub,
      groupId,
      name,
      description,
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
