import { Repository } from '@/core/repositories/repository';
import { Branch } from '../../enterprise/entities/branch';
import { BranchWithDetails } from '../../enterprise/entities/value-objects/branch-with-details';

export abstract class BranchesRepository extends Repository<Branch> {
  abstract create(branch: Branch): Promise<void>;
  abstract save(branch: Branch): Promise<void>;
  abstract findById(id: string): Promise<Branch | null>;
  abstract findByIdWithDetails(id: string): Promise<BranchWithDetails | null>;
  abstract fetchByEmployerId(id: string): Promise<Branch[]>;
}
