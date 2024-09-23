import { ApiProperty } from '@nestjs/swagger';
import { BranchObjectDTO } from './create-branch.dto';

export class FetchBranchesByEmployerIdResponse {
  @ApiProperty({
    type: BranchObjectDTO,
    isArray: true,
  })
  branches: BranchObjectDTO;
}
