import {
  BadRequestException,
  Body,
  Controller,
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
import { CreateDepartmentUseCase } from '@/domain/registrations/application/use-cases/create-department';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import {
  CreateDepartmentDTO,
  CreateDepartmentResponse,
} from '../dto/create-department.dto';
import { DepartmentPresenter } from '../presenters/department-presenter';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';

@Controller('/employers/:employerId/departments')
export class CreateDepartmentController {
  constructor(private createDepartment: CreateDepartmentUseCase) {}

  @ApiTags('Employers')
  @ApiCreatedResponse({
    type: CreateDepartmentResponse,
    description: 'New Department',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not allowed to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employer was not found',
  })
  @ApiOperation({
    summary: 'Create new department',
  })
  @ApiBearerAuth()
  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateDepartmentDTO,
    @Param('employerId', new IsValidUUIDPipe('employerId')) employerId: string,
  ) {
    const { description, name } = body;
    const { sub, subscription } = user;

    const result = await this.createDepartment.execute({
      subscriptionId: subscription,
      executorId: sub,
      employerId,
      name,
      description,
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

    const { department } = result.value;

    return { department: DepartmentPresenter.toHttp(department) };
  }
}
