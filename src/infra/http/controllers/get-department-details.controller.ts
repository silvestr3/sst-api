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
import { GetDepartmentDetailsUseCase } from '@/domain/registrations/application/use-cases/get-department-details';
import { GetDepartmentDetailsResponse } from '../dto/get-department-details.dto';
import { DepartmentDetailsPresenter } from '../presenters/department-details-presenter';

@Controller('/departments/:departmentId/details')
export class GetDepartmentDetailsController {
  constructor(private getDepartmentDetails: GetDepartmentDetailsUseCase) {}

  @ApiTags('Departments')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: GetDepartmentDetailsResponse,
    description: 'Department details',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Department was not found',
  })
  @ApiOperation({
    summary: 'Get department details by id',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('departmentId', new IsValidUUIDPipe('departmentId'))
    departmentId: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.getDepartmentDetails.execute({
      subscriptionId: subscription,
      executorId: sub,
      departmentId,
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

    const { department } = result.value;

    return { department: DepartmentDetailsPresenter.toHttp(department) };
  }
}
