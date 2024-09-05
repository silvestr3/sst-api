import { Group } from '@/domain/registrations/enterprise/entities/group';
import { GroupObject } from '../dto/fetch-all-groups.dto';

export class GroupPresenter {
  static toHttp(group: Group): GroupObject {
    return {
      id: group.id.toString(),
      name: group.name,
      description: group.description,
      isActive: group.isActive,
    };
  }
}
