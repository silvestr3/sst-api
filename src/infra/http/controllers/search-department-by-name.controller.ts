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
import { DepartmentPresenter } from '../presenters/department-presenter';
import { SearchDepartmentsByNameUseCase } from '@/domain/registrations/application/use-cases/search-department-by-name';
import { FetchDepartmentsByEmployerIdResponse } from '../dto/fetch-departments-by-employer-id.dto';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { UUID } from 'crypto';

@Controller('/departments/search')
export class SearchDepartmentsByNameController {
  constructor(
    private searchDepartmentsByName: SearchDepartmentsByNameUseCase,
  ) {}

  @ApiTags('Departments')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FetchDepartmentsByEmployerIdResponse,
    description: 'List of departments',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiOperation({
    summary: 'Search departments from subscription by name ',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('employerId', new IsValidUUIDPipe('employerId')) employerId: UUID,
    @Query('q') query: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.searchDepartmentsByName.execute({
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

    const { departments } = result.value;

    const presenterDepartments = departments.map(DepartmentPresenter.toHttp);

    return { departments: presenterDepartments };
  }
}
