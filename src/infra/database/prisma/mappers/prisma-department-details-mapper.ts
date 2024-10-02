import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DepartmentWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/department-with-details';
import {
  Department as PrismaDepartment,
  Employer as PrismaEmployer,
} from '@prisma/client';

type PrismaDepartmentWithDetails = PrismaDepartment & {
  employer: PrismaEmployer;
};

export class PrismaDepartmentDetailsMapper {
  static toDomain(raw: PrismaDepartmentWithDetails): DepartmentWithDetails {
    return DepartmentWithDetails.create({
      subscriptionId: new UniqueEntityID(raw.subscriptionId),
      departmentId: new UniqueEntityID(raw.id),
      description: raw.description,
      name: raw.name,
      employer: {
        employerId: new UniqueEntityID(raw.employer.id),
        nomeFantasia: raw.employer.nomeFantasia,
        razaoSocial: raw.employer.razaoSocial,
      },
    });
  }
}
