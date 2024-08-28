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

  async create(group: Group): Promise<void> {
    this.items.push(group);
  }

  async save(group: Group): Promise<void> {
    const index = this.items.findIndex((item) => group.id.equals(item.id));

    this.items[index] = group;
  }
}
