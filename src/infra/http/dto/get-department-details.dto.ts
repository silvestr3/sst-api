import { ApiProperty } from '@nestjs/swagger';

export class EmployerInfoDTO {
  @ApiProperty()
  employerId: string;

  @ApiProperty()
  razaoSocial: string;

  @ApiProperty()
  nomeFantasia: string;
}

export class DepartmentDetailsDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: EmployerInfoDTO })
  employer: EmployerInfoDTO;
}

export class GetDepartmentDetailsResponse {
  @ApiProperty({ type: DepartmentDetailsDTO })
  department: DepartmentDetailsDTO;
}
