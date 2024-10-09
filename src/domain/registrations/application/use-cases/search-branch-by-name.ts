import { Either, left, right } from '@/core/either';
import { Branch } from '../../enterprise/entities/branch';
import { BranchesRepository } from '../repositories/branches-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { EmployersRepository } from '../repositories/employers-repository';
import { Employer } from '../../enterprise/entities/employer';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface SearchBranchesByNameParams {
  subscriptionId: string;
  executorId: string;
  employerId?: string;
  searchTerm: string;
}

type SearchBranchesByNameResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { branches: Branch[] }
>;

@Injectable()
export class SearchBranchesByNameUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private branchesRepository: BranchesRepository,
    private employersRepository: EmployersRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
    searchTerm,
  }: SearchBranchesByNameParams): Promise<SearchBranchesByNameResponse> {
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

    const branches = await this.branchesRepository.searchByName(
      subscription.id.toString(),
      employer.id.toString(),
      searchTerm,
    );

    return right({ branches });
  }
}
