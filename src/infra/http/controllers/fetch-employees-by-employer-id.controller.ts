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
import { EmployerPresenter } from '../presenters/employer-presenter';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { FetchEmployeesByEmployerIdUseCase } from '@/domain/registrations/application/use-cases/fetch-employees-by-employer-id';
import { EmployeePresenter } from '../presenters/employee-presenter';
import { FetchEmployeesByEmployerIdResponse } from '../dto/fetch-employees-by-employer-id.dto';

@Controller('/employers/:employerId/employees')
export class FetchEmployeesByEmployerIdController {
  constructor(
    private fetchEmployeesByEmployerId: FetchEmployeesByEmployerIdUseCase,
  ) {}

  @ApiTags('Employers')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FetchEmployeesByEmployerIdResponse,
    description: 'List of employees in the employer',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employer was not found',
  })
  @ApiOperation({
    summary: 'List all employees of the employer',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('employerId', new IsValidUUIDPipe('employerId')) employerId: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.fetchEmployeesByEmployerId.execute({
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

    const { employees } = result.value;

    const presenterEmployees = employees.map(EmployeePresenter.toHttp);

    return { employees: presenterEmployees };
  }
}
