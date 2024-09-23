import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LinkAddressDTO {
  @ApiProperty()
  @IsUUID()
  addressId: string;
}
