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
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { LinkDoctorToEmployerUseCase } from '@/domain/registrations/application/use-cases/link-doctor-to-employer';
import { LinkDoctorDTO } from '../dto/link-doctor-to-employer.dto';

@Controller('/employers/:employerId/doctor')
export class LinkDoctorToEmployerController {
  constructor(private linkDoctorToemployer: LinkDoctorToEmployerUseCase) {}

  @ApiTags('Employers')
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: 'Doctor successfully linked to employer',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employer or doctor was not found',
  })
  @ApiOperation({
    summary: 'Link doctor to employer',
  })
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('employerId', new IsValidUUIDPipe('employerId')) employerId: string,
    @Body() body: LinkDoctorDTO,
  ) {
    const { sub, subscription } = user;
    const { doctorId } = body;

    const result = await this.linkDoctorToemployer.execute({
      subscriptionId: subscription,
      executorId: sub,
      employerId,
      doctorId,
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
