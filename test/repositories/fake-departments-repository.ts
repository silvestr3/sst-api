import { DepartmentesRepository } from '@/domain/registrations/application/repositories/departments-repository';
import { Department } from '@/domain/registrations/enterprise/entities/department';
import { DepartmentWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/department-with-details';
import { FakeEmployersRepository } from './fake-employers-repository';

export class FakeDepartmentsRepository implements DepartmentesRepository {
  constructor(private employersRepository: FakeEmployersRepository) {}

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

  async findByIdWithDetails(id: string): Promise<DepartmentWithDetails | null> {
    const department = this.items.find((item) => item.id.toString() === id);

    if (!department) return null;

    const employer = this.employersRepository.items.find((item) =>
      item.id.equals(department.employerId),
    );

    return DepartmentWithDetails.create({
      subscriptionId: department.subscriptionId,
      departmentId: department.id,
      name: department.name,
      description: department.description,
      employer: {
        employerId: employer.id,
        nomeFantasia: employer.nomeFantasia,
        razaoSocial: employer.nomeFantasia,
      },
    });
  }
}
