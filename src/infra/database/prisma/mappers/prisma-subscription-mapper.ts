import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Subscription } from '@/domain/registrations/enterprise/entities/subscription';
import { Subscription as PrismaSubscription } from '@prisma/client';

export class PrismaSubscriptionMapper {
  static toDomain(raw: PrismaSubscription): Subscription {
    return Subscription.create(
      {
        administratorId: new UniqueEntityID(raw.administratorId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: Subscription): PrismaSubscription {
    return {
      id: raw.id.toString(),
      administratorId: raw.administratorId.toString(),
    };
  }
}
