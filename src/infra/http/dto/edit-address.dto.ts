import { IsOptional, IsString } from 'class-validator';

export class EditAddressDTO {
  @IsString()
  @IsOptional()
  cep: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  district: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  state: string;
}
