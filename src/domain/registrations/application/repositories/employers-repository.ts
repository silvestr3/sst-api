import { Repository } from '@/core/repositories/repository';
import { Employer } from '../../enterprise/entities/employer';

export abstract class EmployersRepository extends Repository<Employer> {
  abstract create(employer: Employer): Promise<void>;
  abstract save(employer: Employer): Promise<void>;
  abstract findById(id: string): Promise<Employer | null>;
  abstract fetchByGroupId(groupId: string): Promise<Employer[]>;
}
