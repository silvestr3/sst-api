import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAddressDTO {
  @IsString()
  @ApiProperty()
  cep: string;

  @IsString()
  @ApiProperty()
  street: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;
}

export class AddressObjectDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsString()
  cep: string;

  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;
}
