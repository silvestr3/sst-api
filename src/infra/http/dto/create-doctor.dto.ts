import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDoctorDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  crm: string;

  @ApiProperty()
  @IsString()
  ufCrm: string;

  @ApiProperty()
  @IsString()
  phone: string;
}

export class DoctorObject {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  crm: string;

  @ApiProperty()
  ufCrm: string;

  @ApiProperty()
  phone: string;
}

export class CreateDoctorResponseDTO {
  @ApiProperty({ type: DoctorObject })
  doctor: DoctorObject;
}
