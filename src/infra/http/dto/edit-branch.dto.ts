import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EditBranchDTO {
  @ApiProperty()
  @IsString()
  name: string;
}
