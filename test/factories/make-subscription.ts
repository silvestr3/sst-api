import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Subscription,
  SubscriptionProps,
} from '@/domain/registrations/enterprise/entities/subscription';
import { randomUUID } from 'crypto';

export function makeSubscription(
  override: Partial<SubscriptionProps> = {},
  id?: UniqueEntityID,
) {
  const subscription = Subscription.create(
    {
      administratorId: new UniqueEntityID(randomUUID()),
      ...override,
    },
    id,
  );

  return subscription;
}
