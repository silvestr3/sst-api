import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateDepartmentDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class DepartmentObjectDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employerId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class CreateDepartmentResponse {
  @ApiProperty({ type: DepartmentObjectDTO })
  department: DepartmentObjectDTO;
}
