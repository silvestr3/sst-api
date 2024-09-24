import {
  BadRequestException,
  Controller,
  Get,
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
import { FetchAllDoctorsUseCase } from '@/domain/registrations/application/use-cases/fetch-all-doctors';
import { DoctorPresenter } from '../presenters/doctor-presenter';
import { FetchAllDoctorsResponse } from '../dto/fetch-all-doctors.dto';

@Controller('/doctors')
export class FetchAllDoctorsController {
  constructor(private fetchAllDoctors: FetchAllDoctorsUseCase) {}

  @ApiTags('Doctors')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FetchAllDoctorsResponse,
    description: 'List of doctors',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiOperation({
    summary: 'List all doctors from subscription',
  })
  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub, subscription } = user;

    const result = await this.fetchAllDoctors.execute({
      subscriptionId: subscription,
      executorId: sub,
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

    const { doctors } = result.value;

    const presenterDoctors = doctors.map(DoctorPresenter.toHttp);

    return { doctors: presenterDoctors };
  }
}
