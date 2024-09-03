import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Department } from '@/domain/registrations/enterprise/entities/department';
import { Department as PrismaDepartment } from '@prisma/client';

export class PrismaDepartmentMapper {
  static toDomain(raw: PrismaDepartment): Department {
    return Department.create(
      {
        subscriptionId: new UniqueEntityID(raw.subscriptionId),
        employerId: new UniqueEntityID(raw.employerId),
        name: raw.name,
        description: raw.description,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: Department): PrismaDepartment {
    return {
      id: raw.id.toString(),
      subscriptionId: raw.subscriptionId.toString(),
      employerId: raw.employerId.toString(),
      name: raw.name,
      description: raw.description,
    };
  }
}
