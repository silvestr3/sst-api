import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';
import { BranchWithDetails } from '../../enterprise/entities/value-objects/branch-with-details';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { BranchesRepository } from '../repositories/branches-repository';

interface GetBranchDetailsParams {
  subscriptionId: string;
  executorId: string;
  branchId: string;
}

type GetBranchDetailsResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { branch: BranchWithDetails }
>;

@Injectable()
export class GetBranchDetailsUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private branchsRepository: BranchesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    branchId,
  }: GetBranchDetailsParams): Promise<GetBranchDetailsResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const branch = await this.branchsRepository.findByIdWithDetails(branchId);

    if (!branch) {
      return left(new ResourceNotFoundError());
    }

    if (!branch.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    return right({ branch });
  }
}
