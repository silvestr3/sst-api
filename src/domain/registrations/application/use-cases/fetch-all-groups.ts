import { Either, left, right } from '@/core/either';
import { Group } from '../../enterprise/entities/group';
import { GroupsRepository } from '../repositories/groups-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface FetchAllGroupsParams {
  subscriptionId: string;
  executorId: string;
}

type FetchAllGroupsResponse = Either<NotAllowedError, { groups: Group[] }>;

export class FetchAllGroupsUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
  }: FetchAllGroupsParams): Promise<FetchAllGroupsResponse> {
    const subscription =
      await this.subscriptionsRepository.findById(subscriptionId);

    if (
      !subscription ||
      subscription.administratorId.toString() !== executorId
    ) {
      return left(new NotAllowedError());
    }

    const groups = await this.groupsRepository.findAll(
      subscription.id.toString(),
    );

    return right({ groups });
  }
}
