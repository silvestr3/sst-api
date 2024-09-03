import { SubscriptionsRepository } from '@/domain/registrations/application/repositories/subscriptions-repository';
import { Subscription } from '@/domain/registrations/enterprise/entities/subscription';

export class FakeSubscriptionsRepository implements SubscriptionsRepository {
  public items: Subscription[] = [];

  async findById(id: string): Promise<Subscription | null> {
    const subscription = this.items.find((item) => item.id.toString() === id);

    return subscription ?? null;
  }

  async create(subscription: Subscription): Promise<void> {
    this.items.push(subscription);
  }
}
