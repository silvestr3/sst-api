import { BranchesRepository } from '@/domain/registrations/application/repositories/branches-repository';
import { Branch } from '@/domain/registrations/enterprise/entities/branch';

export class FakeBranchesRepository implements BranchesRepository {
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
}
