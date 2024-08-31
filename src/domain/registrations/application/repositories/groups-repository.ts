import { Repository } from '@/core/repositories/repository';
import { Group } from '../../enterprise/entities/group';

export abstract class GroupsRepository extends Repository<Group> {
  abstract create(group: Group): Promise<void>;
  abstract save(group: Group): Promise<void>;
  abstract delete(group: Group): Promise<void>;
  abstract findAll(subscriptionId: string): Promise<Group[]>;
  abstract findById(id: string): Promise<Group | null>;
}
