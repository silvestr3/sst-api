import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EmployersRepository } from '../repositories/employers-repository';
import { DepartmentesRepository } from '../repositories/departments-repository';
import { Department } from '../../enterprise/entities/department';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';
import { AddressesRepository } from '../repositories/addresses-repository';

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

    const employer = await this.employersRepository.findById(employerId);

    if (!employer) {
      return left(new ResourceNotFoundError());
    }

    if (!employer.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    const address = await this.addressesRepository.findById(addressId);

    if (!address) {
      return left(new ResourceNotFoundError());
    }

    if (!address.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    employer.addressId = address.id;
    await this.employersRepository.save(employer);

    return right(null);
  }
}
