import { DepartmentesRepository } from '@/domain/registrations/application/repositories/departments-repository';
import { Department } from '@/domain/registrations/enterprise/entities/department';

export class FakeDepartmentsRepository implements DepartmentesRepository {
  public items: Department[] = [];

  async create(department: Department): Promise<void> {
    this.items.push(department);
  }

  async save(department: Department): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(department.id));

    this.items[index] = department;
  }

  async findById(id: string): Promise<Department | null> {
    const department = this.items.find((item) => item.id.toString() === id);

    return department ?? null;
  }

  async fetchByEmployerId(id: string): Promise<Department[]> {
    const departments = this.items.filter(
      (item) => item.employerId.toString() === id,
    );

    return departments;
  }
}
