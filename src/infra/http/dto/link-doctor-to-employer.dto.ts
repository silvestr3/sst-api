import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LinkDoctorDTO {
  @ApiProperty()
  @IsUUID()
  doctorId: string;
}
