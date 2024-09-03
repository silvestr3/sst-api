import { AdministratorsRepository } from '@/domain/registrations/application/repositories/administrators-repository';
import { Administrator } from '@/domain/registrations/enterprise/entities/administrator';

export class FakeAdministratorsRepository implements AdministratorsRepository {
  public items: Administrator[] = [];

  async findById(id: string): Promise<Administrator | null> {
    const administrator = this.items.find((item) => item.id.toString() === id);

    return administrator ?? null;
  }

  async findByEmail(email: string): Promise<Administrator | null> {
    const administrator = this.items.find((item) => item.email === email);

    return administrator ?? null;
  }

  async create(administrator: Administrator): Promise<void> {
    this.items.push(administrator);
  }

  async save(administrator: Administrator): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.id.equals(administrator.id),
    );

    this.items[index] = administrator;
  }
}
