import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreatePositionDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  cbo: string;
}

export class PositionObject {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  cbo: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

export class CreatePositionResponse {
  @ApiProperty({
    type: PositionObject,
  })
  position: PositionObject;
}
