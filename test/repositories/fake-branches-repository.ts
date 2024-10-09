import { BranchesRepository } from '@/domain/registrations/application/repositories/branches-repository';
import { Address } from '@/domain/registrations/enterprise/entities/address';
import { Branch } from '@/domain/registrations/enterprise/entities/branch';
import { BranchWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/branch-with-details';
import { FakeAddressesRepository } from './fake-addresses-repository';
import { FakeEmployersRepository } from './fake-employers-repository';

export class FakeBranchesRepository implements BranchesRepository {
  constructor(
    private addressesRepository: FakeAddressesRepository,
    private employersRepository: FakeEmployersRepository,
  ) {}

  public items: Branch[] = [];

  async create(branch: Branch): Promise<void> {
    this.items.push(branch);
  }

  async save(branch: Branch): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(branch.id));

    this.items[index] = branch;
  }

  async findById(id: string): Promise<Branch | null> {
    const branch = this.items.find((item) => item.id.toString() === id);

    return branch ?? null;
  }

  async findByIdWithDetails(id: string): Promise<BranchWithDetails | null> {
    let address: Address;

    const branch = this.items.find((item) => item.id.toString() === id);

    if (!branch) return null;

    const employer = this.employersRepository.items.find((item) =>
      item.id.equals(branch.employerId),
    );

    if (branch.addressId) {
      address = this.addressesRepository.items.find((item) =>
        item.id.equals(branch.addressId),
      );
    }

    return BranchWithDetails.create({
      subscriptionId: branch.subscriptionId,
      branchId: branch.id,
      name: branch.name,
      address: address
        ? {
            addressId: address.id,
            cep: address.cep,
            city: address.city,
            district: address.district,
            state: address.state,
            street: address.street,
            complement: address.complement,
            number: address.number,
          }
        : null,
      employer: {
        employerId: employer.id,
        nomeFantasia: employer.nomeFantasia,
        razaoSocial: employer.nomeFantasia,
      },
    });
  }

  async fetchByEmployerId(id: string): Promise<Branch[]> {
    const branches = this.items.filter(
      (item) => item.employerId.toString() === id,
    );

    return branches;
  }

  async searchByName(
    subscriptionId: string,
    employerId: string,
    searchTerm: string,
  ): Promise<Branch[]> {
    const branches = this.items.filter(
      (item) =>
        item.subscriptionId.toString() === subscriptionId &&
        item.employerId.toString() === employerId &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return branches;
  }
}
