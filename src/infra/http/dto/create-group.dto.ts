import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { GroupObject } from './fetch-all-groups.dto';

export class CreateGroupDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}

export class CreateGroupResponseDTO {
  @ApiProperty({ type: GroupObject })
  group: GroupObject;
}
