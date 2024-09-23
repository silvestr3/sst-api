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
import { EditBranchUseCase } from '@/domain/registrations/application/use-cases/edit-branch';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { EditBranchDTO } from '../dto/edit-branch.dto';

@Controller('/branches/:branchId')
export class EditBranchController {
  constructor(private editBranch: EditBranchUseCase) {}

  @ApiTags('Branches')
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'User is not allowed to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Branch was not found',
  })
  @ApiOperation({
    summary: 'Edit branch',
  })
  @ApiBearerAuth()
  @HttpCode(204)
  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('branchId', new IsValidUUIDPipe('branchId'))
    branchId: string,
    @Body() body: EditBranchDTO,
  ) {
    const { name } = body;
    const { sub, subscription } = user;

    const result = await this.editBranch.execute({
      subscriptionId: subscription,
      executorId: sub,
      branchId,
      name,
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
