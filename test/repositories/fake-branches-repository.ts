import { BranchesRepository } from '@/domain/registrations/application/repositories/branches-repository';
import { Branch } from '@/domain/registrations/enterprise/entities/branch';

export class FakeBranchesRepository implements BranchesRepository {
  public items: Branch[] = [];

  async create(branch: Branch): Promise<void> {
    this.items.push(branch);
  }
}
