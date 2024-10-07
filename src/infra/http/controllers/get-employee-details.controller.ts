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
import { GetEmployeeDetailsUseCase } from '@/domain/registrations/application/use-cases/get-employee-details';
import { GetEmployeeDetailsResponse } from '../dto/get-employee-details.dto';
import { EmployeeDetailsPresenter } from '../presenters/employee-details-presenter';

@Controller('/employees/:employeeId')
export class GetEmployeeDetailsController {
  constructor(private getEmployeeDetails: GetEmployeeDetailsUseCase) {}

  @ApiTags('Employees')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: GetEmployeeDetailsResponse,
    description: 'Employee details',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employee was not found',
  })
  @ApiOperation({
    summary: 'Get employee details by id',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('employeeId', new IsValidUUIDPipe('employeeId'))
    employeeId: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.getEmployeeDetails.execute({
      subscriptionId: subscription,
      executorId: sub,
      employeeId,
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

    const { employee } = result.value;

    return { employee: EmployeeDetailsPresenter.toHttp(employee) };
  }
}
