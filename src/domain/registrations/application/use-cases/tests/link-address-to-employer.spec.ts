import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { LinkAddressToEmployerUseCase } from '../link-address-to-employer';
import { makeAddress } from 'test/factories/make-address';

describe('Link address to employer tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let employersRepository: FakeEmployersRepository;
  let addressesRepository: FakeAddressesRepository;
  let sut: LinkAddressToEmployerUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    employersRepository = new FakeEmployersRepository();
    addressesRepository = new FakeAddressesRepository();

    sut = new LinkAddressToEmployerUseCase(
      subscriptionsRepository,
      employersRepository,
      addressesRepository,
    );
  });

  it('Should be able to link an address to employer', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    const address = makeAddress({
      subscriptionId: subscription.id,
    });
    addressesRepository.items.push(address);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
      addressId: address.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(employersRepository.items[0].addressId).toEqual(address.id);
  });
});
