import { EmployeesRepository } from '@/domain/registrations/application/repositories/employees-repository';
import { Employee } from '@/domain/registrations/enterprise/entities/employee';

export class FakeEmployeesRepository implements EmployeesRepository {
  public items: Employee[] = [];

  async create(employee: Employee): Promise<void> {
    this.items.push(employee);
  }

  async save(employee: Employee): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(employee.id));

    this.items[index] = employee;
  }

  async findById(id: string): Promise<Employee | null> {
    const employee = this.items.find((item) => item.id.toString() === id);

    return employee ?? null;
  }

  async fetchByEmployerId(employerId: string): Promise<Employee[]> {
    const employees = this.items.filter(
      (item) => item.employerId.toString() === employerId,
    );

    return employees;
  }
}
