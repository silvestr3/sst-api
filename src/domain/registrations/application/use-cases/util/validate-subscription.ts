import { SubscriptionsRepository } from '../../repositories/subscriptions-repository';

interface ValidateSubscriptionParams {
  subscriptionsRepository: SubscriptionsRepository;
  subscriptionId: string;
  executorId: string;
}

export async function validateSubscription({
  executorId,
  subscriptionId,
  subscriptionsRepository,
}: ValidateSubscriptionParams) {
  const subscription = await subscriptionsRepository.findById(subscriptionId);

  if (!subscription || subscription.administratorId.toString() !== executorId) {
    return null;
  }

  return subscription;
}
