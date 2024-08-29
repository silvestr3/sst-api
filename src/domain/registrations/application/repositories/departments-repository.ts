import { Department } from '../../enterprise/entities/department';

export abstract class DepartmentesRepository {
  abstract create(department: Department): Promise<void>;
}
