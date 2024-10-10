import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { EmployerObject } from './fetch-employers-by-group-id.dto';

enum eSocialEnrollmentTypeValues {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

export class CreateEmployerDTO {
  @ApiProperty()
  @IsString()
  @IsUUID()
  groupId: string;

  @ApiProperty({
    enum: eSocialEnrollmentTypeValues,
    example: eSocialEnrollmentTypeValues.CPF,
  })
  @IsString()
  @IsEnum(eSocialEnrollmentTypeValues)
  eSocialEnrollmentType: eSocialEnrollmentTypeValues;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cpf: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cnpj: string;

  @ApiProperty()
  @IsString()
  razaoSocial: string;

  @ApiProperty()
  @IsString()
  nomeFantasia: string;

  @ApiProperty()
  @IsString()
  cnae: string;

  @ApiProperty()
  @IsString()
  activity: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  riskLevel: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  addressId: string;
}

export class CreateEmployerResponseDTO {
  @ApiProperty({ type: EmployerObject })
  employer: EmployerObject;
}
