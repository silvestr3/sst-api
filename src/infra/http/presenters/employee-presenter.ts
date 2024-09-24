import { Employee } from '@/domain/registrations/enterprise/entities/employee';
import { EmployeeObjectDTO } from '../dto/create-employee.dto';

export class EmployeePresenter {
  static toHttp(employee: Employee): EmployeeObjectDTO {
    return {
      id: employee.id.toString(),
      name: employee.name,
      groupId: employee.groupId.toString(),
      employerId: employee.employerId.toString(),
      branchId: employee.branchId.toString(),
      departmentId: employee.departmentId.toString(),
      positionId: employee.positionId.toString(),
      admissionDate: employee.admissionDate,
      birthDate: employee.birthDate,
      cpf: employee.cpf.value,
      gender: employee.gender,
      hasEmploymentRelationship: employee.hasEmploymentRelationship,
      registration: employee.registration,
      status: employee.status,
    };
  }
}
