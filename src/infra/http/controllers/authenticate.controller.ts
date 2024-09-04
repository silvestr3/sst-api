import { AuthenticateUseCase } from '@/domain/registrations/application/use-cases/authenticate';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { Public } from '@/infra/auth/public.decorator';
import {
  ApiCreatedResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { InvalidCredentialsError } from '@/domain/registrations/application/use-cases/errors/invalid-credentials-error';

class AuthenticateDTO {
  @ApiProperty()
  @IsString()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

class AuthenticateResponse {
  @ApiProperty()
  token: string;
}

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticate: AuthenticateUseCase) {}

  @ApiTags('Accounts')
  @ApiCreatedResponse({
    type: AuthenticateResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @Post()
  async handle(@Body() body: AuthenticateDTO) {
    const { email, password } = body;

    const result = await this.authenticate.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { token } = result.value;

    return { token };
  }
}
