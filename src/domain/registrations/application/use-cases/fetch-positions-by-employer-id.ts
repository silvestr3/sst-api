import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Employer } from '../../enterprise/entities/employer';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Department } from '../../enterprise/entities/department';
import { EmployersRepository } from '../repositories/employers-repository';
import { PositionsRepository } from '../repositories/positions-repository';
import { Injectable } from '@nestjs/common';

interface FetchPositionsByEmployerIdParams {
  subscriptionId: string;
  executorId: string;
  employerId: string;
}

type FetchPositionsByEmployerIdResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { positions: Department[] }
>;

@Injectable()
export class FetchPositionsByEmployerIdUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private positionsRepository: PositionsRepository,
    private employersRepository: EmployersRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
  }: FetchPositionsByEmployerIdParams): Promise<FetchPositionsByEmployerIdResponse> {
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

    const positions = await this.positionsRepository.fetchByEmployerId(
      employer.id.toString(),
    );

    return right({ positions });
  }
}
