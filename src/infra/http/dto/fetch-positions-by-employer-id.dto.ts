import { ApiProperty } from '@nestjs/swagger';
import { PositionObject } from './create-position.dto';

export class FetchPositionsByEmployerIdResponse {
  @ApiProperty({ type: PositionObject, isArray: true })
  positions: PositionObject[];
}
