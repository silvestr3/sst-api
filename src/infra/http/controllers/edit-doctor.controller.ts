import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { EditDoctorUseCase } from '@/domain/registrations/application/use-cases/edit-doctor';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EditDoctorDTO } from '../dto/edit-doctor.dto';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { UUID } from 'crypto';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

@Controller('/doctors/:doctorId')
export class EditDoctorController {
  constructor(private editDoctor: EditDoctorUseCase) {}

  @ApiTags('Doctors')
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'User is not allowed to perform this action',
  })
  @ApiOperation({
    summary: 'Edit doctor',
  })
  @ApiBearerAuth()
  @HttpCode(204)
  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: EditDoctorDTO,
    @Param('doctorId', new IsValidUUIDPipe('doctorId')) doctorId: UUID,
  ) {
    const { name, crm, phone, ufCrm } = body;
    const { sub, subscription } = user;

    const result = await this.editDoctor.execute({
      subscriptionId: subscription,
      executorId: sub,
      doctorId,
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
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
