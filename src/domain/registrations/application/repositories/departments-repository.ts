import { Repository } from '@/core/repositories/repository';
import { Department } from '../../enterprise/entities/department';
import { DepartmentWithDetails } from '../../enterprise/entities/value-objects/department-with-details';

export abstract class DepartmentsRepository extends Repository<Department> {
  abstract create(department: Department): Promise<void>;
  abstract save(department: Department): Promise<void>;
  abstract findById(id: string): Promise<Department | null>;
  abstract findByIdWithDetails(
    id: string,
  ): Promise<DepartmentWithDetails | null>;
  abstract fetchByEmployerId(id: string): Promise<Department[]>;
  abstract searchByName(
    subscriptionId: string,
    employerId: string,
    searchTerm: string,
  ): Promise<Department[]>;
}
