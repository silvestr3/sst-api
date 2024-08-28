import { Subscription } from '../../enterprise/entities/subscription';

export abstract class SubscriptionsRepository {
  abstract findById(id: string): Promise<Subscription | null>;
}
