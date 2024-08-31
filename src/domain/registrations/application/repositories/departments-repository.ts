import { Repository } from '@/core/repositories/repository';
import { Department } from '../../enterprise/entities/department';

export abstract class DepartmentesRepository extends Repository<Department> {
  abstract create(department: Department): Promise<void>;
  abstract save(department: Department): Promise<void>;
  abstract findById(id: string): Promise<Department | null>;
}
