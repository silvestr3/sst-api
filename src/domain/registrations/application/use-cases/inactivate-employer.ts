import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Employer } from '../../enterprise/entities/employer';
import { EmployersRepository } from '../repositories/employers-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Injectable } from '@nestjs/common';

interface InactivateEmployerParams {
  subscriptionId: string;
  executorId: string;
  employerId: string;
}

type InactivateEmployerResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { employer: Employer }
>;

@Injectable()
export class InactivateEmployerUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private employersRepository: EmployersRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
  }: InactivateEmployerParams): Promise<InactivateEmployerResponse> {
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

    employer.isActive = false;

    await this.employersRepository.save(employer);

    return right({ employer });
  }
}
