import { Repository } from '@/core/repositories/repository';
import { Employee } from '../../enterprise/entities/employee';
import { EmployeeWithDetails } from '../../enterprise/entities/value-objects/employee-with-details';

export abstract class EmployeesRepository extends Repository<Employee> {
  abstract create(employee: Employee): Promise<void>;
  abstract save(employee: Employee): Promise<void>;
  abstract findById(id: string): Promise<Employee | null>;
  abstract findByIdWithDetails(id: string): Promise<EmployeeWithDetails | null>;
  abstract fetchByEmployerId(employerId: string): Promise<Employee[]>;
  abstract searchByName(
    subscriptionId: string,
    employerId: string,
    searchTerm: string,
  ): Promise<Employee[]>;
}
