import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
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
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { CreateEmployeeUseCase } from '@/domain/registrations/application/use-cases/create-employee';
import {
  CreateEmployeeDTO,
  CreateEmployeeResponse,
} from '../dto/create-employee.dto';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { EmployeePresenter } from '../presenters/employee-presenter';

@Controller('/employers/:employerId/employees')
export class CreateEmployeeController {
  constructor(private createEmployee: CreateEmployeeUseCase) {}

  @ApiTags('Employers')
  @ApiCreatedResponse({
    type: CreateEmployeeResponse,
    description: 'New Employee',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not allowed to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employer, branch, department or position was not found',
  })
  @ApiOperation({
    summary: 'Create new employee',
  })
  @ApiBearerAuth()
  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateEmployeeDTO,
    @Param('employerId', new IsValidUUIDPipe('employerId')) employerId: string,
  ) {
    const {
      groupId,
      branchId,
      departmentId,
      positionId,
      name,
      cpf,
      gender,
      admissionDate,
      birthDate,
      hasEmploymentRelationship,
      registration,
      email,
    } = body;
    const { sub, subscription } = user;

    const result = await this.createEmployee.execute({
      subscriptionId: subscription,
      executorId: sub,
      employerId,
      name,
      groupId,
      branchId,
      departmentId,
      positionId,
      cpf,
      gender,
      admissionDate,
      birthDate,
      hasEmploymentRelationship,
      registration,
      email,
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

    return { employee: EmployeePresenter.toHttp(employee) };
  }
}
