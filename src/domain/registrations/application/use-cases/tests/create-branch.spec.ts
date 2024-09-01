import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { CreateBranchUseCase } from '../create-branch';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { FakeBranchesRepository } from 'test/repositories/fake-branches-repository';
import { makeAddress } from 'test/factories/make-address';
import { makeEmployer } from 'test/factories/make-employer';

describe('Create branch tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let employersRepository: FakeEmployersRepository;
  let addressesRepository: FakeAddressesRepository;
  let branchesRepository: FakeBranchesRepository;
  let sut: CreateBranchUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    employersRepository = new FakeEmployersRepository();
    addressesRepository = new FakeAddressesRepository();
    branchesRepository = new FakeBranchesRepository();

    sut = new CreateBranchUseCase(
      subscriptionsRepository,
      employersRepository,
      addressesRepository,
      branchesRepository,
    );
  });

  it('Should be able to create a new branch', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const address = makeAddress({
      subscriptionId: subscription.id,
    });
    addressesRepository.items.push(address);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
      name: 'New branch',
      addressId: address.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(branchesRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'New branch',
        addressId: address.id,
      }),
    );
  });

  it('Should set the new branch address the same as employers address if addressId is not set', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const address = makeAddress({
      subscriptionId: subscription.id,
    });
    addressesRepository.items.push(address);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
      addressId: address.id,
    });
    employersRepository.items.push(employer);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
      name: 'New branch',
    });

    expect(result.isRight()).toBeTruthy();
    expect(branchesRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'New branch',
        addressId: address.id,
      }),
    );
  });
});
