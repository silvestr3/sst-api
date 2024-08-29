import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Address } from '../../enterprise/entities/address';
import { AddressesRepository } from '../repositories/addresses-repository';
import { validateSubscription } from './util/validate-subscription';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface EditAddressParams {
  subscriptionId: string;
  executorId: string;
  addressId: string;
  cep?: string;
  street?: string;
  complement?: string;
  number?: number;
  district?: string;
  city?: string;
  state?: string;
}

type EditAddressResponse = Either<NotAllowedError, { address: Address }>;

export class EditAddressUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    addressId,
    cep,
    street,
    complement,
    number,
    district,
    city,
    state,
  }: EditAddressParams): Promise<EditAddressResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const address = await this.addressesRepository.findById(addressId);

    if (!address) {
      return left(new ResourceNotFoundError());
    }

    if (!address.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    address.cep = cep;
    address.street = street;
    address.complement = complement;
    address.number = number;
    address.district = district;
    address.city = city;
    address.state = state;

    await this.addressesRepository.save(address);

    return right({ address });
  }
}
