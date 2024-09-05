import { ApiProperty } from '@nestjs/swagger';

export class GroupObject {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isActive: boolean;
}

export class FetchAllGroupsResponse {
  @ApiProperty({ type: GroupObject, isArray: true })
  groups: GroupObject;
}
