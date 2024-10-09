import { Either, left, right } from '@/core/either';
import { Position } from '../../enterprise/entities/position';
import { PositionsRepository } from '../repositories/positions-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { EmployersRepository } from '../repositories/employers-repository';
import { Employer } from '../../enterprise/entities/employer';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface SearchPositionsByNameParams {
  subscriptionId: string;
  executorId: string;
  employerId?: string;
  searchTerm: string;
}

type SearchPositionsByNameResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { positions: Position[] }
>;

@Injectable()
export class SearchPositionsByNameUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private positionsRepository: PositionsRepository,
    private employersRepository: EmployersRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
    searchTerm,
  }: SearchPositionsByNameParams): Promise<SearchPositionsByNameResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const getEmployer = await validateResourceOwnership<Employer>({
      repository: this.employersRepository,
      resourceId: employerId,
      subscriptionId: subscription.id,
    });

    if (getEmployer.isLeft()) {
      return left(getEmployer.value);
    }

    const employer = getEmployer.value;

    const positions = await this.positionsRepository.searchByName(
      subscription.id.toString(),
      employer.id.toString(),
      searchTerm,
    );

    return right({ positions });
  }
}
