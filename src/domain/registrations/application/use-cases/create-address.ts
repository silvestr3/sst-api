import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Address } from '../../enterprise/entities/address';
import { AddressesRepository } from '../repositories/addresses-repository';

interface CreateAddressParams {
  subscriptionId: string;
  executorId: string;
  cep: string;
  street: string;
  complement: string;
  number?: number;
  district: string;
  city: string;
  state: string;
}

type CreateAddressResponse = Either<NotAllowedError, { address: Address }>;

export class CreateAddressUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    cep,
    street,
    complement,
    number,
    district,
    city,
    state,
  }: CreateAddressParams): Promise<CreateAddressResponse> {
    const subscription =
      await this.subscriptionsRepository.findById(subscriptionId);

    if (
      !subscription ||
      subscription.administratorId.toString() !== executorId
    ) {
      return left(new NotAllowedError());
    }

    const address = Address.create({
      subscriptionId: subscription.id,
      cep,
      street,
      complement,
      number,
      district,
      city,
      state,
    });

    await this.addressesRepository.create(address);

    return right({ address });
  }
}
