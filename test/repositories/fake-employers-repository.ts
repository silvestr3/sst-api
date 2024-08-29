import { EmployersRepository } from '@/domain/registrations/application/repositories/employers-repository';
import { Employer } from '@/domain/registrations/enterprise/entities/employer';

export class FakeEmployersRepository implements EmployersRepository {
  public items: Employer[] = [];

  async create(employer: Employer): Promise<void> {
    this.items.push(employer);
  }

  async fetchByGroupId(groupId: string): Promise<Employer[]> {
    const employers = this.items.filter(
      (item) => item.groupId.toString() === groupId,
    );

    return employers;
  }
}
