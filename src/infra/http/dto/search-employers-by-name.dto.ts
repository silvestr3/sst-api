import { ApiProperty } from '@nestjs/swagger';
import { EmployerObject } from './fetch-employers-by-group-id.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class SearchEmployersByNameResponseDTO {
  @ApiProperty({ type: EmployerObject, isArray: true })
  employers: EmployerObject[];
}

export class SearchEmployersByNameQueryParamsDTO {
  @ApiProperty()
  @IsString()
  q: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  groupId: UUID;
}
