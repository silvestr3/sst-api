import { Either, left, right } from '@/core/either';
import { Group } from '../../enterprise/entities/group';
import { GroupsRepository } from '../repositories/groups-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { EmployersRepository } from '../repositories/employers-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Employer } from '../../enterprise/entities/employer';

interface FetchEmployersByGroupIdParams {
  subscriptionId: string;
  executorId: string;
  groupId: string;
}

type FetchEmployersByGroupIdResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { employers: Employer[] }
>;

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

    const group = await this.groupsRepository.findById(groupId);

    if (!group) {
      return left(new ResourceNotFoundError());
    }

    if (!group.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    const employers = await this.employersRepository.fetchByGroupId(
      group.id.toString(),
    );

    return right({ employers });
  }
}
