import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { GroupObject } from './fetch-all-groups.dto';

export class CreateGroupDTO {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
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
