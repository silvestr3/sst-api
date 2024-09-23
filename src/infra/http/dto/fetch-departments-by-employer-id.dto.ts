import { ApiProperty } from '@nestjs/swagger';
import { DepartmentObjectDTO } from './create-department.dto';

export class FetchDepartmentsByEmployerIdResponse {
  @ApiProperty({
    type: DepartmentObjectDTO,
    isArray: true,
  })
  departments: DepartmentObjectDTO;
}
