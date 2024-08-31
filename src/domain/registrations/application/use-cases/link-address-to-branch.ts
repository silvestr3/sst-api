import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { BranchesRepository } from '../repositories/branches-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';
import { AddressesRepository } from '../repositories/addresses-repository';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Branch } from '../../enterprise/entities/branch';
import { Address } from '../../enterprise/entities/address';

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

    const getBranch = await validateResourceOwnership<Branch>({
      repository: this.branchesRepository,
      resourceId: branchId,
      subscriptionId: subscription.id,
    });

    if (getBranch.isLeft()) {
      return left(getBranch.value);
    }

    const getAddress = await validateResourceOwnership<Address>({
      repository: this.addressesRepository,
      resourceId: addressId,
      subscriptionId: subscription.id,
    });

    if (getAddress.isLeft()) {
      return left(getAddress.value);
    }

    const address = getAddress.value;
    const branch = getBranch.value;

    branch.addressId = address.id;
    await this.branchesRepository.save(branch);

    return right(null);
  }
}
