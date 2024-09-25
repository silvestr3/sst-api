import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GroupObject } from './fetch-all-groups.dto';

export enum eSocialEnrollmentTypeValues {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

export class EmployerObject {
  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: eSocialEnrollmentTypeValues,
    example: eSocialEnrollmentTypeValues.CPF,
  })
  eSocialEnrollmentType: 'CPF' | 'CNPJ';

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  cnpj: string;

  @ApiProperty()
  razaoSocial: string;

  @ApiProperty()
  nomeFantasia: string;

  @ApiProperty()
  cnae: string;

  @ApiProperty()
  activity: string;

  @ApiProperty()
  @IsNumber()
  riskLevel: number;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  addressId: string;
}

export class FetchEmployersByGroupIdResponse {
  @ApiProperty({ type: GroupObject, isArray: false })
  group: GroupObject;

  @ApiProperty({ type: EmployerObject, isArray: true })
  employers: EmployerObject[];
}
