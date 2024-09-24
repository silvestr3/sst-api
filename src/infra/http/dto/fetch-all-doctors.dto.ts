import { ApiProperty } from '@nestjs/swagger';
import { DoctorObject } from './create-doctor.dto';

export class FetchAllDoctorsResponse {
  @ApiProperty({ type: DoctorObject, isArray: true })
  doctors: DoctorObject[];
}
