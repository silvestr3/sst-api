import { ApiProperty } from '@nestjs/swagger';
import { Gender } from './create-employee.dto';
import { EmployeeStatus } from './edit-employee.dto';

export class EmployerInfoDTO {
  @ApiProperty()
  employerId: string;

  @ApiProperty()
  razaoSocial: string;

  @ApiProperty()
  nomeFantasia: string;
}

export class BranchInfoDTO {
  @ApiProperty()
  branchId: string;

  @ApiProperty()
  name: string;
}

export class DepartmentInfoDTO {
  @ApiProperty()
  departmentId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class PositionInfoDTO {
  @ApiProperty()
  positionId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  cbo: string;
}

export class EmployeeDetailsDTO {
  @ApiProperty()
  id: string;

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

  @ApiProperty()
  lastClinicalEvaluation?: Date;

  @ApiProperty({ enum: Gender })
  gender: 'MALE' | 'FEMALE';

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: EmployeeStatus })
  status: 'ACTIVE' | 'INACTIVE' | 'VACATIONS' | 'REMOVED';

  @ApiProperty({ type: EmployerInfoDTO })
  employer: EmployerInfoDTO;

  @ApiProperty({ type: BranchInfoDTO })
  branch: BranchInfoDTO;

  @ApiProperty({ type: DepartmentInfoDTO })
  department: DepartmentInfoDTO;

  @ApiProperty({ type: PositionInfoDTO })
  position: PositionInfoDTO;
}

export class GetEmployeeDetailsResponse {
  @ApiProperty({ type: EmployeeDetailsDTO })
  employee: EmployeeDetailsDTO;
}
