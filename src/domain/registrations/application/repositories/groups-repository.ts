import { Group } from '../../enterprise/entities/group';

export abstract class GroupsRepository {
  abstract create(group: Group): Promise<void>;
  abstract save(group: Group): Promise<void>;
  abstract findAll(subscriptionId: string): Promise<Group[]>;
}
