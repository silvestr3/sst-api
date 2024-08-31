import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { BranchesRepository } from '../repositories/branches-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';
import { AddressesRepository } from '../repositories/addresses-repository';

interface LinkAddressToBranchParams {
  subscriptionId: string;
  executorId: string;
  branchId: string;
  addressId: string;
}

type LinkAddressToBranchResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

export class LinkAddressToBranchUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private branchesRepository: BranchesRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    branchId,
    addressId,
  }: LinkAddressToBranchParams): Promise<LinkAddressToBranchResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const branch = await this.branchesRepository.findById(branchId);

    if (!branch) {
      return left(new ResourceNotFoundError());
    }

    if (!branch.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    const address = await this.addressesRepository.findById(addressId);

    if (!address) {
      return left(new ResourceNotFoundError());
    }

    if (!address.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    branch.addressId = address.id;
    await this.branchesRepository.save(branch);

    return right(null);
  }
}
