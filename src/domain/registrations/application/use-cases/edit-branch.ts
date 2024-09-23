import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Branch } from '../../enterprise/entities/branch';
import { BranchesRepository } from '../repositories/branches-repository';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface EditBranchParams {
  subscriptionId: string;
  executorId: string;
  branchId: string;
  name: string;
}

type EditBranchResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { branch: Branch }
>;

@Injectable()
export class EditBranchUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private branchesRepository: BranchesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    branchId,
    name,
  }: EditBranchParams): Promise<EditBranchResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const getBranch = await validateResourceOwnership<Branch>({
      repository: this.branchesRepository,
      resourceId: branchId,
      subscriptionId: subscription.id,
    });

    if (getBranch.isLeft()) {
      return left(getBranch.value);
    }

    const branch = getBranch.value;

    branch.name = name;

    await this.branchesRepository.save(branch);

    return right({ branch });
  }
}
