import { Repository } from '@/core/repositories/repository';
import { Branch } from '../../enterprise/entities/branch';

export abstract class BranchesRepository extends Repository<Branch> {
  abstract create(branch: Branch): Promise<void>;
  abstract save(branch: Branch): Promise<void>;
  abstract findById(id: string): Promise<Branch | null>;
}
