import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Position } from '@/domain/registrations/enterprise/entities/position';
import { Position as PrismaPosition } from '@prisma/client';

export class PrismaPositionMapper {
  static toDomain(raw: PrismaPosition): Position {
    return Position.create(
      {
        subscriptionId: new UniqueEntityID(raw.subscriptionId),
        employerId: new UniqueEntityID(raw.employerId),
        name: raw.name,
        description: raw.description,
        isActive: raw.isActive,
        cbo: raw.cbo,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: Position): PrismaPosition {
    return {
      id: raw.id.toString(),
      subscriptionId: raw.subscriptionId.toString(),
      employerId: raw.employerId.toString(),
      name: raw.name,
      description: raw.description,
      isActive: raw.isActive,
      cbo: raw.cbo,
    };
  }
}
