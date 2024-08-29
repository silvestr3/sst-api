import { Either, left, right } from '@/core/either';
import { Group } from '../../enterprise/entities/group';
import { GroupsRepository } from '../repositories/groups-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface EditGroupParams {
  subscriptionId: string;
  executorId: string;
  groupId: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

type EditGroupResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { group: Group }
>;

export class EditGroupUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    groupId,
    name,
    description,
    isActive,
  }: EditGroupParams): Promise<EditGroupResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const group = await this.groupsRepository.findById(groupId);

    if (!group) {
      return left(new ResourceNotFoundError());
    }

    if (!group.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    group.name = name;
    group.description = description;
    group.isActive = isActive;

    await this.groupsRepository.save(group);

    return right({ group });
  }
}
