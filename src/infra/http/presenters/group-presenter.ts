import { Group } from '@/domain/registrations/enterprise/entities/group';
import { GroupObject } from '../dto/fetch-all-groups.dto';

export class GroupPresenter {
  static toHttp(group: Group): GroupObject {
    return {
      name: group.name,
      description: group.description,
      isActive: group.isActive,
    };
  }
}
