import { EmployeeDetailsDTO } from '../dto/get-employee-details.dto';
import { EmployeeWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/employee-with-details';

export class EmployeeDetailsPresenter {
  static toHttp(employee: EmployeeWithDetails): EmployeeDetailsDTO {
    return {
      id: employee.employeeId.toString(),
      name: employee.name,
      cpf: employee.cpf.value,
      admissionDate: employee.admissionDate,
      birthDate: employee.birthDate,
      hasEmploymentRelationship: employee.hasEmploymentRelationship,
      registration: employee.registration ?? undefined,
      lastClinicalEvaluation: employee.lastClinicalEvaluation ?? undefined,
      gender: employee.gender,
      email: employee.email,
      status: employee.status,
      employer: {
        employerId: employee.employer.employerId.toString(),
        nomeFantasia: employee.employer.nomeFantasia,
        razaoSocial: employee.employer.razaoSocial,
      },
      branch: {
        branchId: employee.branch.branchId.toString(),
        name: employee.branch.name,
      },
      department: {
        departmentId: employee.department.departmentId.toString(),
        name: employee.department.name,
        description: employee.department.description,
      },
      position: {
        positionId: employee.position.positionId.toString(),
        name: employee.position.name,
        description: employee.position.description,
        cbo: employee.position.cbo,
      },
    };
  }
}
