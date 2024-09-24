import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateDoctorUseCase } from '@/domain/registrations/application/use-cases/create-doctor';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import {
  CreateDoctorDTO,
  CreateDoctorResponseDTO,
} from '../dto/create-doctor.dto';
import { DoctorPresenter } from '../presenters/doctor-presenter';

@Controller('/doctors')
export class CreateDoctorController {
  constructor(private createDoctor: CreateDoctorUseCase) {}

  @ApiTags('Doctors')
  @ApiCreatedResponse({
    type: CreateDoctorResponseDTO,
    description: 'New Doctor',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not allowed to perform this action',
  })
  @ApiOperation({
    summary: 'Create new doctor',
  })
  @ApiBearerAuth()
  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateDoctorDTO,
  ) {
    const { name, crm, phone, ufCrm } = body;
    const { sub, subscription } = user;

    const result = await this.createDoctor.execute({
      subscriptionId: subscription,
      executorId: sub,
      name,
      crm,
      phone,
      ufCrm,
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

    const { doctor } = result.value;

    return { doctor: DoctorPresenter.toHttp(doctor) };
  }
}
