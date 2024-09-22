import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthenticateDTO {
  @ApiProperty()
  @IsString()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class AuthenticateResponseDTO {
  @ApiProperty()
  token: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  profilePicture: string;

  @ApiProperty()
  id: string;
}
