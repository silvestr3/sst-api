import { Either, left, right } from '@/core/either';
import { Group } from '../../enterprise/entities/group';
import { GroupsRepository } from '../repositories/groups-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';
import { EmployerWithDetails } from '../../enterprise/entities/value-objects/employer-with-details';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { EmployersRepository } from '../repositories/employers-repository';

interface GetEmployerDetailsParams {
  subscriptionId: string;
  executorId: string;
  employerId: string;
}

type GetEmployerDetailsResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { employer: EmployerWithDetails }
>;

@Injectable()
export class GetEmployerDetailsUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private employersRepository: EmployersRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
  }: GetEmployerDetailsParams): Promise<GetEmployerDetailsResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const employer =
      await this.employersRepository.findByIdWithDetails(employerId);

    if (!employer) {
      return left(new ResourceNotFoundError());
    }

    if (!employer.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    return right({ employer });
  }
}
