import { IsOptional, IsString } from 'class-validator';

export class CreateAddressDTO {
  @IsString()
  cep: string;

  @IsString()
  street: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  district: string;

  @IsString()
  city: string;

  @IsString()
  state: string;
}
