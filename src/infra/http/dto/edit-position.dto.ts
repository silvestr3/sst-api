import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class EditPositionDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cbo: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
