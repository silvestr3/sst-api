import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EmployersRepository } from '../repositories/employers-repository';
import { DepartmentesRepository } from '../repositories/departments-repository';
import { Department } from '../../enterprise/entities/department';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';
import { AddressesRepository } from '../repositories/addresses-repository';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Address } from '../../enterprise/entities/address';
import { Employer } from '../../enterprise/entities/employer';

interface LinkAddressToEmployerParams {
  subscriptionId: string;
  executorId: string;
  employerId: string;
  addressId: string;
}

type LinkAddressToEmployerResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

export class LinkAddressToEmployerUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private employersRepository: EmployersRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
    addressId,
  }: LinkAddressToEmployerParams): Promise<LinkAddressToEmployerResponse> {
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

    const getAddress = await validateResourceOwnership<Address>({
      repository: this.addressesRepository,
      resourceId: addressId,
      subscriptionId: subscription.id,
    });

    if (getAddress.isLeft()) {
      return left(getAddress.value);
    }

    const address = getAddress.value;
    const employer = getEmployer.value;

    employer.addressId = address.id;
    await this.employersRepository.save(employer);

    return right(null);
  }
}
