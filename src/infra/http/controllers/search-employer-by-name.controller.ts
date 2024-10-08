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
import { EmployerPresenter } from '../presenters/employer-presenter';
import { SearchEmployersByNameUseCase } from '@/domain/registrations/application/use-cases/search-employer-by-name';
import {
  SearchEmployersByNameQueryParamsDTO,
  SearchEmployersByNameResponseDTO,
} from '../dto/search-employers-by-name.dto';

@Controller('/employers/search')
export class SearchEmployersByNameController {
  constructor(private searchEmployersByName: SearchEmployersByNameUseCase) {}

  @ApiTags('Employers')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: SearchEmployersByNameResponseDTO,
    description: 'List of employers',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiOperation({
    summary: 'Search employers from subscription by name ',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query() { groupId, q: query }: SearchEmployersByNameQueryParamsDTO,
  ) {
    const { sub, subscription } = user;

    const result = await this.searchEmployersByName.execute({
      subscriptionId: subscription,
      executorId: sub,
      searchTerm: query,
      groupId,
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

    const { employers } = result.value;

    const presenterEmployers = employers.map(EmployerPresenter.toHttp);

    return { employers: presenterEmployers };
  }
}
