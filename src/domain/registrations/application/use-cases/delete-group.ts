import { Either, left, right } from '@/core/either';
import { Group } from '../../enterprise/entities/group';
import { GroupsRepository } from '../repositories/groups-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface DeleteGroupParams {
  subscriptionId: string;
  executorId: string;
  groupId: string;
}

type DeleteGroupResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

export class DeleteGroupUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    groupId,
  }: DeleteGroupParams): Promise<DeleteGroupResponse> {
    const subscription =
      await this.subscriptionsRepository.findById(subscriptionId);

    if (
      !subscription ||
      subscription.administratorId.toString() !== executorId
    ) {
      return left(new NotAllowedError());
    }

    const group = await this.groupsRepository.findById(groupId);

    if (!group) {
      return left(new ResourceNotFoundError());
    }

    if (group.subscriptionId !== subscription.id) {
      return left(new NotAllowedError());
    }

    await this.groupsRepository.delete(group);

    return right(null);
  }
}
