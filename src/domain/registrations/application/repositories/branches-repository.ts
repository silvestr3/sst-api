import { Branch } from '../../enterprise/entities/branch';

export abstract class BranchesRepository {
  abstract create(branch: Branch): Promise<void>;
}
