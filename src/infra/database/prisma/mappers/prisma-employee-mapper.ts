import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Employee } from '@/domain/registrations/enterprise/entities/employee';
import { Cpf } from '@/domain/registrations/enterprise/entities/value-objects/cpf';
import { Employee as PrismaEmployee } from '@prisma/client';

export class PrismaEmployeeMapper {
  static toDomain(raw: PrismaEmployee): Employee {
    return Employee.create(
      {
        subscriptionId: new UniqueEntityID(raw.subscriptionId),
        employerId: new UniqueEntityID(raw.employerId),
        groupId: new UniqueEntityID(raw.groupId),
        branchId: new UniqueEntityID(raw.branchId),
        departmentId: new UniqueEntityID(raw.departmentId),
        positionId: new UniqueEntityID(raw.positionId),
        name: raw.name,
        email: raw.email,
        admissionDate: raw.admissionDate,
        birthDate: raw.birthDate,
        cpf: Cpf.validateAndCreate(raw.cpf),
        gender: raw.gender,
        hasEmploymentRelationship: raw.hasEmploymentRelationship,
        registration: raw.registration,
        status: raw.status,
        lastClinicalEvaluation: raw.lastClinicalEvaluation,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: Employee): PrismaEmployee {
    return {
      id: raw.id.toString(),
      subscriptionId: raw.subscriptionId.toString(),
      employerId: raw.employerId.toString(),
      groupId: raw.groupId.toString(),
      branchId: raw.branchId.toString(),
      departmentId: raw.departmentId.toString(),
      positionId: raw.positionId.toString(),
      name: raw.name,
      email: raw.email,
      admissionDate: raw.admissionDate,
      birthDate: raw.birthDate,
      cpf: raw.cpf.value,
      gender: raw.gender,
      hasEmploymentRelationship: raw.hasEmploymentRelationship,
      registration: raw.registration,
      status: raw.status,
      lastClinicalEvaluation: raw.lastClinicalEvaluation,
    };
  }
}
