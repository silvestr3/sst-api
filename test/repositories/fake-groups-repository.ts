import { GroupsRepository } from '@/domain/registrations/application/repositories/groups-repository';
import { Group } from '@/domain/registrations/enterprise/entities/group';

export class FakeGroupsRepository implements GroupsRepository {
  public items: Group[] = [];

  async findAll(subscriptionId: string): Promise<Group[]> {
    const groups = this.items.filter(
      (item) => item.subscriptionId.toString() === subscriptionId,
    );

    return groups;
  }

  async findById(id: string): Promise<Group | null> {
    const group = this.items.find((item) => item.id.toString() === id);

    return group ?? null;
  }

  async delete(group: Group): Promise<void> {
    const index = this.items.findIndex((item) => group.id.equals(item.id));

    this.items.splice(index, 1);
  }

  async create(group: Group): Promise<void> {
    this.items.push(group);
  }

  async save(group: Group): Promise<void> {
    const index = this.items.findIndex((item) => group.id.equals(item.id));

    this.items[index] = group;
  }

  async searchByName(
    subscriptionId: string,
    searchTerm: string,
  ): Promise<Group[]> {
    const groups = this.items.filter(
      (item) =>
        item.subscriptionId.toString() === subscriptionId &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return groups;
  }
}
