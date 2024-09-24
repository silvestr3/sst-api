import { Repository } from '@/core/repositories/repository';
import { Employee } from '../../enterprise/entities/employee';

export abstract class EmployeesRepository extends Repository<Employee> {
  abstract create(employee: Employee): Promise<void>;
  abstract save(employee: Employee): Promise<void>;
  abstract findById(id: string): Promise<Employee | null>;
  abstract fetchByEmployerId(employerId: string): Promise<Employee[]>;
}
