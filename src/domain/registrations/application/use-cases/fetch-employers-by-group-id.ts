import { Either, left, right } from '@/core/either';
import { Group } from '../../enterprise/entities/group';
import { GroupsRepository } from '../repositories/groups-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { EmployersRepository } from '../repositories/employers-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Employer } from '../../enterprise/entities/employer';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Injectable } from '@nestjs/common';

interface FetchEmployersByGroupIdParams {
  subscriptionId: string;
  executorId: string;
  groupId: string;
}

type FetchEmployersByGroupIdResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { employers: Employer[] }
>;
@Injectable()
export class FetchEmployersByGroupIdUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private groupsRepository: GroupsRepository,
    private employersRepository: EmployersRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    groupId,
  }: FetchEmployersByGroupIdParams): Promise<FetchEmployersByGroupIdResponse> {
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

    const employers = await this.employersRepository.fetchByGroupId(
      group.id.toString(),
    );

    return right({ employers });
  }
}
