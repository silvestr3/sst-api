import { Either, left, right } from '@/core/either';
import { GroupsRepository } from '../repositories/groups-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { EmployersRepository } from '../repositories/employers-repository';
import { GroupNotEmptyError } from './errors/group-not-empty-error';
import { validateSubscription } from './util/validate-subscription';

interface DeleteGroupParams {
  subscriptionId: string;
  executorId: string;
  groupId: string;
}

type DeleteGroupResponse = Either<
  NotAllowedError | ResourceNotFoundError | GroupNotEmptyError,
  null
>;

export class DeleteGroupUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
    private employersRepository: EmployersRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    groupId,
  }: DeleteGroupParams): Promise<DeleteGroupResponse> {
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

    if (group.subscriptionId !== subscription.id) {
      return left(new NotAllowedError());
    }

    const employersOnGroup = await this.employersRepository.fetchByGroupId(
      group.id.toString(),
    );

    if (employersOnGroup.length > 0) {
      return left(new GroupNotEmptyError());
    }

    await this.groupsRepository.delete(group);

    return right(null);
  }
}
