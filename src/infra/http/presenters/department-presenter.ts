import { Department } from '@/domain/registrations/enterprise/entities/department';
import { DepartmentObjectDTO } from '../dto/create-department.dto';

export class DepartmentPresenter {
  static toHttp(department: Department): DepartmentObjectDTO {
    return {
      id: department.id.toString(),
      employerId: department.employerId.toString(),
      name: department.name,
      description: department.description,
    };
  }
}
