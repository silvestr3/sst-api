import { ApiProperty } from '@nestjs/swagger';
import { Gender } from './create-employee.dto';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  VACATIONS = 'VACATIONS',
  REMOVED = 'REMOVED',
}

export class EditEmployeeDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(11)
  cpf: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  admissionDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  birthDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  hasEmploymentRelationship: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  registration?: string;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender: 'MALE' | 'FEMALE';

  @ApiProperty()
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status: 'ACTIVE' | 'INACTIVE' | 'VACATIONS' | 'REMOVED';

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;
}
