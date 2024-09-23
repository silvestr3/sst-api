import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
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
import { DepartmentPresenter } from '../presenters/department-presenter';
import { CreateBranchUseCase } from '@/domain/registrations/application/use-cases/create-branch';
import {
  CreateBranchDTO,
  CreateBranchResponse,
} from '../dto/create-branch.dto';
import { BranchPresenter } from '../presenters/branch-presenter';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

@Controller('/branches')
export class CreateBranchController {
  constructor(private createBranch: CreateBranchUseCase) {}

  @ApiTags('Branches')
  @ApiCreatedResponse({
    type: CreateBranchResponse,
    description: 'New Branch',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not allowed to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employer was not found',
  })
  @ApiOperation({
    summary: 'Create new branch',
  })
  @ApiBearerAuth()
  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateBranchDTO,
  ) {
    const { employerId, name, addressId } = body;
    const { sub, subscription } = user;

    const result = await this.createBranch.execute({
      subscriptionId: subscription,
      executorId: sub,
      employerId,
      name,
      addressId,
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

    const { branch } = result.value;

    return { branch: BranchPresenter.toHttp(branch) };
  }
}
