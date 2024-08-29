import { EmployersRepository } from '@/domain/registrations/application/repositories/employers-repository';
import { Employer } from '@/domain/registrations/enterprise/entities/employer';

export class FakeEmployersRepository implements EmployersRepository {
  public items: Employer[] = [];

  async create(employer: Employer): Promise<void> {
    this.items.push(employer);
  }

  async save(employer: Employer): Promise<void> {
    const index = this.items.findIndex((item) => employer.id.equals(item.id));

    this.items[index] = employer;
  }

  async findById(id: string): Promise<Employer | null> {
    const group = this.items.find((item) => item.id.toString() === id);

    return group ?? null;
  }

  async fetchByGroupId(groupId: string): Promise<Employer[]> {
    const employers = this.items.filter(
      (item) => item.groupId.toString() === groupId,
    );

    return employers;
  }
}
