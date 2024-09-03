import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Group } from '@/domain/registrations/enterprise/entities/group';
import { Group as PrismaGroup } from '@prisma/client';

export class PrismaGroupMapper {
  static toDomain(raw: PrismaGroup): Group {
    return Group.create(
      {
        subscriptionId: new UniqueEntityID(raw.subscriptionId),
        name: raw.name,
        description: raw.description,
        isActive: raw.isActive,
        logoUrl: raw.logoUrl,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: Group): PrismaGroup {
    return {
      id: raw.id.toString(),
      subscriptionId: raw.subscriptionId.toString(),
      name: raw.name,
      description: raw.description,
      isActive: raw.isActive,
      logoUrl: raw.logoUrl,
    };
  }
}
