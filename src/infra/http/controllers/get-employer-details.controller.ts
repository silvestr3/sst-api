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
import { GetEmployerDetailsUseCase } from '@/domain/registrations/application/use-cases/get-employer-details';
import { GetEmployerDetailsResponse } from '../dto/get-employer-details.dto';
import { EmployerDetailsPresenter } from '../presenters/employer-details-presenter';

@Controller('/employers/:employerId/details')
export class GetEmployerDetailsController {
  constructor(private getEmployerDetails: GetEmployerDetailsUseCase) {}

  @ApiTags('Employers')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: GetEmployerDetailsResponse,
    description: 'Employer details',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employer was not found',
  })
  @ApiOperation({
    summary: 'Get employer details by id',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('employerId', new IsValidUUIDPipe('employerId')) employerId: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.getEmployerDetails.execute({
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

    const { employer } = result.value;

    return { employer: EmployerDetailsPresenter.toHttp(employer) };
  }
}
