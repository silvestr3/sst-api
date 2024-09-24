import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { EditEmployeeUseCase } from '@/domain/registrations/application/use-cases/edit-employee';
import { EditEmployeeDTO } from '../dto/edit-employee.dto';

@Controller('/employees/:employeeId')
export class EditEmployeeController {
  constructor(private editEmployee: EditEmployeeUseCase) {}

  @ApiTags('Employees')
  @ApiNoContentResponse({
    description: 'Employee edited successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not allowed to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employee was not found',
  })
  @ApiOperation({
    summary: 'Edit employee',
  })
  @ApiBearerAuth()
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: EditEmployeeDTO,
    @Param('employeeId', new IsValidUUIDPipe('employeeId')) employeeId: string,
  ) {
    const {
      name,
      cpf,
      gender,
      admissionDate,
      birthDate,
      hasEmploymentRelationship,
      registration,
      email,
      status,
    } = body;
    const { sub, subscription } = user;

    const result = await this.editEmployee.execute({
      subscriptionId: subscription,
      executorId: sub,
      employeeId,
      name,
      cpf,
      gender,
      admissionDate,
      birthDate,
      hasEmploymentRelationship,
      registration,
      email,
      status,
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
  }
}
