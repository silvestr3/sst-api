import { Either, left, right } from '@/core/either';
import { Employer } from '../../enterprise/entities/employer';
import { EmployersRepository } from '../repositories/employers-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { GroupsRepository } from '../repositories/groups-repository';
import { Group } from '../../enterprise/entities/group';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface SearchEmployersByNameParams {
  subscriptionId: string;
  executorId: string;
  groupId?: string;
  searchTerm: string;
}

type SearchEmployersByNameResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { employers: Employer[] }
>;

@Injectable()
export class SearchEmployersByNameUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private employersRepository: EmployersRepository,
    private groupsRepository: GroupsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    groupId,
    searchTerm,
  }: SearchEmployersByNameParams): Promise<SearchEmployersByNameResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    let group: Group;

    if (groupId) {
      const getGroup = await validateResourceOwnership<Group>({
        repository: this.groupsRepository,
        resourceId: groupId,
        subscriptionId: subscription.id,
      });

      if (getGroup.isLeft()) {
        return left(getGroup.value);
      }

      group = getGroup.value;
    }

    const employers = await this.employersRepository.searchByName(
      subscription.id.toString(),
      searchTerm,
      group?.id.toString() ?? undefined,
    );

    return right({ employers });
  }
}
