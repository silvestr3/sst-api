import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { CreateAddressUseCase } from '../create-address';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';

describe('Create address tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let addressesRepository: FakeAddressesRepository;
  let sut: CreateAddressUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    addressesRepository = new FakeAddressesRepository();

    sut = new CreateAddressUseCase(
      subscriptionsRepository,
      addressesRepository,
    );
  });

  it('Should be able to create a new address', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      cep: '12312',
      street: 'Test street',
      complement: '',
      number: '2',
      district: 'Test district',
      city: 'Test city',
      state: 'Test state',
    });

    expect(result.isRight()).toBeTruthy();
    expect(addressesRepository.items[0]).toEqual(
      expect.objectContaining({
        street: 'Test street',
        complement: '',
      }),
    );
  });
});
