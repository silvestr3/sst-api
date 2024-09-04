import { CreateAdministratorAccountUseCase } from '@/domain/registrations/application/use-cases/create-administrator-account';
import { AccountAlreadyExistsError } from '@/domain/registrations/application/use-cases/errors/account-already-exists-error';
import { InvalidInformationError } from '@/domain/registrations/application/use-cases/errors/invalid-information-error';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public.decorator';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAdministratorAccountDTO } from '../dto/create-account.dto';

@Controller('/accounts')
@Public()
export class CreateAdministratorAccountController {
  constructor(
    private createAdministratorAccount: CreateAdministratorAccountUseCase,
  ) {}

  @ApiTags('Accounts')
  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    description: 'Some information is missing or invalid',
  })
  @ApiConflictResponse({
    description: 'Account already exists',
  })
  @Post()
  async handle(@Body() body: CreateAdministratorAccountDTO) {
    const { email, password, name, cpf, phone } = body;

    const result = await this.createAdministratorAccount.execute({
      email,
      password,
      name,
      cpf,
      phone,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AccountAlreadyExistsError:
          throw new ConflictException(error.message);
        case InvalidInformationError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
