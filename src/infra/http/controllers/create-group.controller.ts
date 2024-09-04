import { CreateGroupUseCase } from '@/domain/registrations/application/use-cases/create-group';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateGroupDTO } from '../dto/create-group.dto';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

@Controller('/groups')
export class CreateGroupController {
  constructor(private createAdministratorAccount: CreateGroupUseCase) {}

  @ApiTags('Groups')
  @ApiBearerAuth()
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiOperation({
    summary: 'Create new group',
  })
  @Post()
  async handle(@CurrentUser() user: UserPayload, @Body() body: CreateGroupDTO) {
    const { name, description, isActive } = body;
    const { sub, subscription } = user;

    const result = await this.createAdministratorAccount.execute({
      subscriptionId: subscription,
      executorId: sub,
      name,
      description,
      isActive,
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
  }
}
