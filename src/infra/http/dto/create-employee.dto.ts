import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export class CreateEmployeeDTO {
  @ApiProperty()
  @IsUUID()
  groupId: string;

  @ApiProperty()
  @IsUUID()
  branchId: string;

  @ApiProperty()
  @IsUUID()
  departmentId: string;

  @ApiProperty()
  @IsUUID()
  positionId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @Length(11)
  cpf: string;

  @ApiProperty()
  @IsDate()
  admissionDate: Date;

  @ApiProperty()
  @IsDate()
  birthDate: Date;

  @ApiProperty()
  @IsBoolean()
  hasEmploymentRelationship: boolean;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  registration?: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: 'MALE' | 'FEMALE';
}

export class EmployeeObjectDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employerId: string;

  @ApiProperty()
  groupId: string;

  @ApiProperty()
  branchId: string;

  @ApiProperty()
  departmentId: string;

  @ApiProperty()
  positionId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  admissionDate: Date;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty()
  hasEmploymentRelationship: boolean;

  @ApiProperty()
  registration?: string;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
  })
  gender: 'MALE' | 'FEMALE';

  @ApiProperty()
  status: 'ACTIVE' | 'INACTIVE' | 'VACATIONS' | 'REMOVED';
}

export class CreateEmployeeResponse {
  @ApiProperty({ type: EmployeeObjectDTO })
  employee: EmployeeObjectDTO;
}
