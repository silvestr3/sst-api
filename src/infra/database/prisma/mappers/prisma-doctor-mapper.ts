import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Doctor } from '@/domain/registrations/enterprise/entities/doctor';
import { Doctor as PrismaDoctor } from '@prisma/client';

export class PrismaDoctorMapper {
  static toDomain(raw: PrismaDoctor): Doctor {
    return Doctor.create(
      {
        subscriptionId: new UniqueEntityID(raw.subscriptionId),
        name: raw.name,
        crm: raw.crm,
        phone: raw.phone,
        ufCrm: raw.ufCrm,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: Doctor): PrismaDoctor {
    return {
      id: raw.id.toString(),
      subscriptionId: raw.subscriptionId.toString(),
      name: raw.name,
      crm: raw.crm,
      phone: raw.phone,
      ufCrm: raw.ufCrm,
    };
  }
}
