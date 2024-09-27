import { Repository } from '@/core/repositories/repository';
import { Employer } from '../../enterprise/entities/employer';
import { EmployerWithDetails } from '../../enterprise/entities/value-objects/employer-with-details';

export abstract class EmployersRepository extends Repository<Employer> {
  abstract create(employer: Employer): Promise<void>;
  abstract save(employer: Employer): Promise<void>;
  abstract findById(id: string): Promise<Employer | null>;
  abstract findByIdWithDetails(id: string): Promise<EmployerWithDetails | null>;
  abstract fetchByGroupId(groupId: string): Promise<Employer[]>;
}
