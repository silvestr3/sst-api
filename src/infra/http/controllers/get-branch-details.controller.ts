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
import { GetBranchDetailsUseCase } from '@/domain/registrations/application/use-cases/get-branch-details';
import { GetBranchDetailsResponse } from '../dto/get-branch-details.dto';
import { BranchDetailsPresenter } from '../presenters/branch-details-presenter';

@Controller('/branches/:branchId/details')
export class GetBranchDetailsController {
  constructor(private getBranchDetails: GetBranchDetailsUseCase) {}

  @ApiTags('Branches')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: GetBranchDetailsResponse,
    description: 'Branch details',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Branch was not found',
  })
  @ApiOperation({
    summary: 'Get branch details by id',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('branchId', new IsValidUUIDPipe('branchId'))
    branchId: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.getBranchDetails.execute({
      subscriptionId: subscription,
      executorId: sub,
      branchId,
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

    return { branch: BranchDetailsPresenter.toHttp(branch) };
  }
}
