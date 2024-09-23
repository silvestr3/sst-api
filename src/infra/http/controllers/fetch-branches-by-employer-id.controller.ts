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
import { DepartmentPresenter } from '../presenters/department-presenter';
import { FetchBranchesByEmployerIdUseCase } from '@/domain/registrations/application/use-cases/fetch-branches-by-employer-id';
import { BranchPresenter } from '../presenters/branch-presenter';
import { FetchBranchesByEmployerIdResponse } from '../dto/fetch-branches-by-employer-id.dto';

@Controller('/employers/:employerId/branches')
export class FetchBranchesByEmployerIdController {
  constructor(
    private fetchBranchesByEmployerId: FetchBranchesByEmployerIdUseCase,
  ) {}

  @ApiTags('Employers')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FetchBranchesByEmployerIdResponse,
    description: 'List of branches in the employer',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employer was not found',
  })
  @ApiOperation({
    summary: 'List all branches of the employer',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('employerId', new IsValidUUIDPipe('employerId')) employerId: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.fetchBranchesByEmployerId.execute({
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

    const { branches } = result.value;

    const presenterBranches = branches.map(BranchPresenter.toHttp);

    return { branches: presenterBranches };
  }
}
