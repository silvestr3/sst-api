import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PositionWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/position-with-details';
import {
  Position as PrismaPosition,
  Employer as PrismaEmployer,
} from '@prisma/client';

type PrismaPositionWithDetails = PrismaPosition & {
  employer: PrismaEmployer;
};

export class PrismaPositionDetailsMapper {
  static toDomain(raw: PrismaPositionWithDetails): PositionWithDetails {
    return PositionWithDetails.create({
      subscriptionId: new UniqueEntityID(raw.subscriptionId),
      positionId: new UniqueEntityID(raw.id),
      description: raw.description,
      name: raw.name,
      cbo: raw.cbo,
      isActive: raw.isActive,
      employer: {
        employerId: new UniqueEntityID(raw.employer.id),
        nomeFantasia: raw.employer.nomeFantasia,
        razaoSocial: raw.employer.razaoSocial,
      },
    });
  }
}
