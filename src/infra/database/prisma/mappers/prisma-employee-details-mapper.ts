import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Cpf } from '@/domain/registrations/enterprise/entities/value-objects/cpf';
import { EmployeeWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/employee-with-details';
import {
  Employee as PrismaEmployee,
  Branch as PrismaBranch,
  Department as PrismaDepartment,
  Position as PrismaPosition,
  Employer as PrismaEmployer,
} from '@prisma/client';

type PrismaEmployeeDetails = PrismaEmployee & {
  employer: PrismaEmployer;
  branch: PrismaBranch;
  department: PrismaDepartment;
  position: PrismaPosition;
};

export class PrismaEmployeeDetailsMapper {
  static toDomain(raw: PrismaEmployeeDetails): EmployeeWithDetails {
    return EmployeeWithDetails.create({
      subscriptionId: new UniqueEntityID(raw.subscriptionId),
      employeeId: new UniqueEntityID(raw.id),
      name: raw.name,
      cpf: Cpf.validateAndCreate(raw.cpf),
      admissionDate: raw.admissionDate,
      birthDate: raw.birthDate,
      email: raw.email,
      gender: raw.gender,
      hasEmploymentRelationship: raw.hasEmploymentRelationship,
      registration: raw.registration,
      status: raw.status,
      lastClinicalEvaluation: raw.lastClinicalEvaluation,
      employer: {
        employerId: new UniqueEntityID(raw.employer.id),
        nomeFantasia: raw.employer.nomeFantasia,
        razaoSocial: raw.employer.razaoSocial,
      },
      branch: {
        branchId: new UniqueEntityID(raw.branch.id),
        name: raw.branch.name,
      },
      department: {
        departmentId: new UniqueEntityID(raw.department.id),
        name: raw.department.name,
        description: raw.department.description,
      },
      position: {
        positionId: new UniqueEntityID(raw.position.id),
        name: raw.position.name,
        description: raw.position.description,
        cbo: raw.position.cbo,
      },
    });
  }
}
