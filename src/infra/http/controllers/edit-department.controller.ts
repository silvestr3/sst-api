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
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DepartmentPresenter } from '../presenters/department-presenter';
import { EditDepartmentUseCase } from '@/domain/registrations/application/use-cases/edit-department';
import { EditDepartmentDTO } from '../dto/edit-department.dto';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

@Controller('/departments/:departmentId')
export class EditDepartmentController {
  constructor(private editDepartment: EditDepartmentUseCase) {}

  @ApiTags('Departments')
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'User is not allowed to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Department was not found',
  })
  @ApiOperation({
    summary: 'Edit department',
  })
  @ApiBearerAuth()
  @HttpCode(204)
  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('departmentId', new IsValidUUIDPipe('departmentId'))
    departmentId: string,
    @Body() body: EditDepartmentDTO,
  ) {
    const { description, name } = body;
    const { sub, subscription } = user;

    const result = await this.editDepartment.execute({
      subscriptionId: subscription,
      executorId: sub,
      departmentId,
      name,
      description,
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
