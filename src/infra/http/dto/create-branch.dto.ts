import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBranchDTO {
  @ApiProperty()
  @IsUUID()
  employerId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  addressId: string;
}

export class BranchObjectDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employerId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  addressId: string;
}

export class CreateBranchResponse {
  @ApiProperty({ type: BranchObjectDTO })
  branch: BranchObjectDTO;
}
