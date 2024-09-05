import { Either, left, right } from '@/core/either';
import { GroupsRepository } from '../repositories/groups-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { EmployersRepository } from '../repositories/employers-repository';
import { GroupNotEmptyError } from './errors/group-not-empty-error';
import { validateSubscription } from './util/validate-subscription';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Group } from '../../enterprise/entities/group';
import { Injectable } from '@nestjs/common';

interface DeleteGroupParams {
  subscriptionId: string;
  executorId: string;
  groupId: string;
}

type DeleteGroupResponse = Either<
  NotAllowedError | ResourceNotFoundError | GroupNotEmptyError,
  null
>;
@Injectable()
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

    const getGroup = await validateResourceOwnership<Group>({
      repository: this.groupsRepository,
      resourceId: groupId,
      subscriptionId: subscription.id,
    });

    if (getGroup.isLeft()) {
      return left(getGroup.value);
    }

    const group = getGroup.value;

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
