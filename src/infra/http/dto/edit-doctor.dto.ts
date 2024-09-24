import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditDoctorDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  crm?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ufCrm?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone?: string;
}
