import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateAdministratorAccountDTO {
  @ApiProperty()
  @IsString()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'Password must contain at least 8 characters' })
  password: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @Length(11, 11, { message: 'CPF must have length of 11' })
  cpf: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;
}
