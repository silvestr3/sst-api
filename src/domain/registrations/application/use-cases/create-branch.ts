import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Address } from '../../enterprise/entities/address';
import { AddressesRepository } from '../repositories/addresses-repository';
import { validateSubscription } from './util/validate-subscription';
import { Branch } from '../../enterprise/entities/branch';
import { EmployersRepository } from '../repositories/employers-repository';
import { BranchesRepository } from '../repositories/branches-repository';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Employer } from '../../enterprise/entities/employer';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface CreateBranchParams {
  subscriptionId: string;
  executorId: string;
  employerId: string;
  name: string;
  addressId?: string;
}

type CreateBranchResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { branch: Branch }
>;

export class CreateBranchUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private employersRepository: EmployersRepository,
    private addressesRepository: AddressesRepository,
    private branchesRepository: BranchesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
    name,
    addressId,
  }: CreateBranchParams): Promise<CreateBranchResponse> {
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

    let address: Address;
    if (addressId) {
      const getAddress = await validateResourceOwnership<Address>({
        repository: this.addressesRepository,
        resourceId: addressId,
        subscriptionId: subscription.id,
      });

      if (getAddress.isLeft()) {
        return left(getAddress.value);
      }

      address = getAddress.value;
    }

    const branch = Branch.create({
      subscriptionId: subscription.id,
      employerId: employer.id,
      addressId: addressId ? address.id : employer.addressId,
      name,
    });

    await this.branchesRepository.create(branch);

    return right({ branch });
  }
}
