import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { CreateAddressUseCase } from '../create-address';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { makeAddress } from 'test/factories/make-address';
import { EditAddressUseCase } from '../edit-address';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

describe('Edit address tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let addressesRepository: FakeAddressesRepository;
  let sut: EditAddressUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    addressesRepository = new FakeAddressesRepository();

    sut = new EditAddressUseCase(subscriptionsRepository, addressesRepository);
  });

  it('Should be able to edit an address', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const address = makeAddress({
      subscriptionId: subscription.id,
    });
    addressesRepository.items.push(address);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      addressId: address.id.toString(),
      street: 'Edited street name',
    });

    expect(result.isRight()).toBeTruthy();
    expect(addressesRepository.items[0]).toEqual(
      expect.objectContaining({
        street: 'Edited street name',
      }),
    );
  });

  it('Should not be able to edit an address from another subscription', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const address = makeAddress();
    addressesRepository.items.push(address);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      addressId: address.id.toString(),
      street: 'Edited street name',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
