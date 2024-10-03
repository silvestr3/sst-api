import { ApiProperty } from '@nestjs/swagger';
import { EmployerInfoDTO } from './get-department-details.dto';

export class PositionDetailsDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  cbo: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: EmployerInfoDTO })
  employer: EmployerInfoDTO;
}

export class GetPositionDetailsResponse {
  @ApiProperty({ type: PositionDetailsDTO })
  position: PositionDetailsDTO;
}
