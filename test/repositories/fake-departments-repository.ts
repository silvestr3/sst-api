import { DepartmentesRepository } from '@/domain/registrations/application/repositories/departments-repository';
import { Department } from '@/domain/registrations/enterprise/entities/department';

export class FakeDepartmentsRepository implements DepartmentesRepository {
  public items: Department[] = [];

  async create(department: Department): Promise<void> {
    this.items.push(department);
  }

  async findById(id: string): Promise<Department | null> {
    const department = this.items.find((item) => item.id.toString() === id);

    return department ?? null;
  }
}
