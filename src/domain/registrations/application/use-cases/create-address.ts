import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Address } from '../../enterprise/entities/address';
import { AddressesRepository } from '../repositories/addresses-repository';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';

interface CreateAddressParams {
  subscriptionId: string;
  executorId: string;
  cep: string;
  street: string;
  complement?: string;
  number?: string;
  district: string;
  city: string;
  state: string;
}

type CreateAddressResponse = Either<NotAllowedError, { address: Address }>;

@Injectable()
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
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
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
