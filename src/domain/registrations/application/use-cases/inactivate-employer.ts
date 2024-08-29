import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Employer } from '../../enterprise/entities/employer';
import { EmployersRepository } from '../repositories/employers-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';

interface InactivateEmployerParams {
  subscriptionId: string;
  executorId: string;
  employerId: string;
}

type InactivateEmployerResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { employer: Employer }
>;

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

    const employer = await this.employersRepository.findById(employerId);

    if (!employer) {
      return left(new ResourceNotFoundError());
    }

    if (!employer.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    employer.isActive = false;

    await this.employersRepository.save(employer);

    return right({ employer });
  }
}
