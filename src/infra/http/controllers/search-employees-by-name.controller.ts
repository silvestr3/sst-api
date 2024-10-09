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
import { EmployeePresenter } from '../presenters/employee-presenter';
import { FetchEmployeesByEmployerIdResponse } from '../dto/fetch-employees-by-employer-id.dto';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { UUID } from 'crypto';
import { SearchEmployeesByNameUseCase } from '@/domain/registrations/application/use-cases/search-employees-by-name';

@Controller('/employees/search')
export class SearchEmployeesByNameController {
  constructor(private searchEmployeesByName: SearchEmployeesByNameUseCase) {}

  @ApiTags('Employees')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FetchEmployeesByEmployerIdResponse,
    description: 'List of employees',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiOperation({
    summary: 'Search employees from subscription by name ',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('employerId', new IsValidUUIDPipe('employerId')) employerId: UUID,
    @Query('q') query: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.searchEmployeesByName.execute({
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

    const { employees } = result.value;

    const presenterEmployees = employees.map(EmployeePresenter.toHttp);

    return { employees: presenterEmployees };
  }
}
