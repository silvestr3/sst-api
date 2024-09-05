import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CreateEmployerDTO } from '../dto/create-employer.dto';
import { CreateEmployerUseCase } from '@/domain/registrations/application/use-cases/create-employer';
import { MissingInformationError } from '@/domain/registrations/application/use-cases/errors/missing-information-error';
import { InvalidInformationError } from '@/domain/registrations/application/use-cases/errors/invalid-information-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

@Controller('/employers')
export class CreateEmployerController {
  constructor(private createEmployerUseCase: CreateEmployerUseCase) {}

  @ApiTags('Employers')
  @ApiBearerAuth()
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiBadRequestResponse({
    description: 'Invalid information',
  })
  @ApiOperation({
    summary: 'Create new employer',
  })
  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateEmployerDTO,
  ) {
    const {
      groupId,
      eSocialEnrollmentType,
      cpf,
      cnpj,
      razaoSocial,
      nomeFantasia,
      cnae,
      activity,
      riskLevel,
      isActive,
      addressId,
    } = body;
    const { sub, subscription } = user;

    const result = await this.createEmployerUseCase.execute({
      subscriptionId: subscription,
      executorId: sub,
      groupId,
      eSocialEnrollmentType,
      cpf,
      cnpj,
      razaoSocial,
      nomeFantasia,
      cnae,
      activity,
      riskLevel,
      isActive,
      addressId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case MissingInformationError:
        case InvalidInformationError:
          throw new BadRequestException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
