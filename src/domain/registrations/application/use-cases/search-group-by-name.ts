import { Either, left, right } from '@/core/either';
import { Group } from '../../enterprise/entities/group';
import { GroupsRepository } from '../repositories/groups-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';

interface SearchGroupsByNameParams {
  subscriptionId: string;
  executorId: string;
  searchTerm: string;
}

type SearchGroupsByNameResponse = Either<NotAllowedError, { groups: Group[] }>;

@Injectable()
export class SearchGroupsByNameUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    searchTerm,
  }: SearchGroupsByNameParams): Promise<SearchGroupsByNameResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const groups = await this.groupsRepository.searchByName(
      subscription.id.toString(),
      searchTerm,
    );

    return right({ groups });
  }
}
