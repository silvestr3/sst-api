import { Repository } from '@/core/repositories/repository';
import { Subscription } from '../../enterprise/entities/subscription';

export abstract class SubscriptionsRepository extends Repository<Subscription> {
  abstract findById(id: string): Promise<Subscription | null>;
}
