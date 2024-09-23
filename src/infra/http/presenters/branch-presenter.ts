import { Branch } from '@/domain/registrations/enterprise/entities/branch';
import { BranchObjectDTO } from '../dto/create-branch.dto';

export class BranchPresenter {
  static toHttp(branch: Branch): BranchObjectDTO {
    return {
      id: branch.id.toString(),
      employerId: branch.employerId.toString(),
      name: branch.name,
      addressId: branch.addressId ? branch.addressId.toString() : undefined,
    };
  }
}
