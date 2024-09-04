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
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Public } from '@/infra/auth/public.decorator';

class CreateAdministratorAccountDTO {
  @IsString()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must contain at least 8 characters' })
  password: string;

  @IsString()
  name: string;

  @IsString()
  @Length(11, 11, { message: 'CPF must have length of 11' })
  cpf: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

@Controller('/accounts')
@Public()
export class CreateAdministratorAccountController {
  constructor(
    private createAdministratorAccount: CreateAdministratorAccountUseCase,
  ) {}

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
