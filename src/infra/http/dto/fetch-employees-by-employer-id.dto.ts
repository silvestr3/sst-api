import { ApiProperty } from '@nestjs/swagger';
import { EmployeeObjectDTO } from './create-employee.dto';

export class FetchEmployeesByEmployerIdResponse {
  @ApiProperty({ type: EmployeeObjectDTO, isArray: true })
  employees: EmployeeObjectDTO[];
}
