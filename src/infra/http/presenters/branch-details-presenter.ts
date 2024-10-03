import { BranchDetailsDTO } from '../dto/get-branch-details.dto';
import { BranchWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/branch-with-details';

export class BranchDetailsPresenter {
  static toHttp(branch: BranchWithDetails): BranchDetailsDTO {
    return {
      id: branch.branchId.toString(),
      name: branch.name,
      employer: {
        employerId: branch.employer.employerId.toString(),
        nomeFantasia: branch.employer.nomeFantasia,
        razaoSocial: branch.employer.razaoSocial,
      },
      address: branch.address
        ? {
            addressId: branch.address.addressId.toString(),
            cep: branch.address.cep,
            city: branch.address.cep,
            district: branch.address.district,
            state: branch.address.state,
            street: branch.address.street,
            complement: branch.address.complement,
            number: branch.address.number,
          }
        : undefined,
    };
  }
}
