import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { BranchPresenter } from '../presenters/branch-presenter';
import { SearchBranchesByNameUseCase } from '@/domain/registrations/application/use-cases/search-branch-by-name';
import { FetchBranchesByEmployerIdResponse } from '../dto/fetch-branches-by-employer-id.dto';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { UUID } from 'crypto';

@Controller('/branches/search')
export class SearchBranchesByNameController {
  constructor(private searchBranchesByName: SearchBranchesByNameUseCase) {}

  @ApiTags('Branches')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FetchBranchesByEmployerIdResponse,
    description: 'List of branches',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiOperation({
    summary: 'Search branches from subscription by name ',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('employerId', new IsValidUUIDPipe('employerId')) employerId: UUID,
    @Query('q') query: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.searchBranchesByName.execute({
      subscriptionId: subscription,
      executorId: sub,
      searchTerm: query,
      employerId,
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

    const { branches } = result.value;

    const presenterBranches = branches.map(BranchPresenter.toHttp);

    return { branches: presenterBranches };
  }
}
