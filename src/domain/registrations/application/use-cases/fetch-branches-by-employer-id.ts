import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Employer } from '../../enterprise/entities/employer';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { BranchesRepository } from '../repositories/branches-repository';
import { Branch } from '../../enterprise/entities/branch';
import { EmployersRepository } from '../repositories/employers-repository';
import { Injectable } from '@nestjs/common';

interface FetchBranchesByEmployerIdParams {
  subscriptionId: string;
  executorId: string;
  employerId: string;
}

type FetchBranchesByEmployerIdResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { branches: Branch[] }
>;

@Injectable()
export class FetchBranchesByEmployerIdUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private branchesRepository: BranchesRepository,
    private employersRepository: EmployersRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
  }: FetchBranchesByEmployerIdParams): Promise<FetchBranchesByEmployerIdResponse> {
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

    const branches = await this.branchesRepository.fetchByEmployerId(
      employer.id.toString(),
    );

    return right({ branches });
  }
}
