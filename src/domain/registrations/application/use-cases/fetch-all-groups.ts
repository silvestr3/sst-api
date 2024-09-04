import { Either, left, right } from '@/core/either';
import { Group } from '../../enterprise/entities/group';
import { GroupsRepository } from '../repositories/groups-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';
import { GroupPresenter } from '@/infra/http/presenters/group-presenter';

interface FetchAllGroupsParams {
  subscriptionId: string;
  executorId: string;
}

type FetchAllGroupsResponse = Either<NotAllowedError, { groups: Group[] }>;

@Injectable()
export class FetchAllGroupsUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
  }: FetchAllGroupsParams): Promise<FetchAllGroupsResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const groups = await this.groupsRepository.findAll(
      subscription.id.toString(),
    );

    return right({ groups });
  }
}
