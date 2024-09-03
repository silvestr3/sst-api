import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Address } from '../../enterprise/entities/address';
import { AddressesRepository } from '../repositories/addresses-repository';
import { validateSubscription } from './util/validate-subscription';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateResourceOwnership } from './util/validate-resource-ownership';

interface EditAddressParams {
  subscriptionId: string;
  executorId: string;
  addressId: string;
  cep?: string;
  street?: string;
  complement?: string;
  number?: string;
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

    const getAddress = await validateResourceOwnership<Address>({
      repository: this.addressesRepository,
      resourceId: addressId,
      subscriptionId: subscription.id,
    });

    if (getAddress.isLeft()) {
      return left(getAddress.value);
    }

    const address = getAddress.value;

    address.cep = cep ?? address.cep;
    address.street = street ?? address.street;
    address.complement = complement ?? address.complement;
    address.number = number ?? address.number;
    address.district = district ?? address.district;
    address.city = city ?? address.city;
    address.state = state ?? address.state;

    await this.addressesRepository.save(address);

    return right({ address });
  }
}
