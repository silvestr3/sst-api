import { DepartmentDetailsDTO } from '../dto/get-department-details.dto';
import { DepartmentWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/department-with-details';

export class DepartmentDetailsPresenter {
  static toHttp(department: DepartmentWithDetails): DepartmentDetailsDTO {
    return {
      id: department.departmentId.toString(),
      name: department.name,
      description: department.description,
      employer: {
        employerId: department.employer.employerId.toString(),
        nomeFantasia: department.employer.nomeFantasia,
        razaoSocial: department.employer.razaoSocial,
      },
    };
  }
}
