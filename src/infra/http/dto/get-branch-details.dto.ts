import { ApiProperty } from '@nestjs/swagger';
import { EmployerInfoDTO } from './get-department-details.dto';
import { AddressInfoDTO } from './get-employer-details.dto';

export class BranchDetailsDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: EmployerInfoDTO })
  employer: EmployerInfoDTO;

  @ApiProperty({ type: AddressInfoDTO })
  address: AddressInfoDTO;
}

export class GetBranchDetailsResponse {
  @ApiProperty({ type: BranchDetailsDTO })
  branch: BranchDetailsDTO;
}
