import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { makeAddress } from 'test/factories/make-address';
import { LinkAddressToBranchUseCase } from '../link-address-to-branch';
import { FakeBranchesRepository } from 'test/repositories/fake-branches-repository';
import { makeBranch } from 'test/factories/make-branch';

describe('Link address to branch tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let branchesRepository: FakeBranchesRepository;
  let addressesRepository: FakeAddressesRepository;
  let sut: LinkAddressToBranchUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    branchesRepository = new FakeBranchesRepository();
    addressesRepository = new FakeAddressesRepository();

    sut = new LinkAddressToBranchUseCase(
      subscriptionsRepository,
      branchesRepository,
      addressesRepository,
    );
  });

  it('Should be able to link an address to branch', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const branch = makeBranch({
      subscriptionId: subscription.id,
    });
    branchesRepository.items.push(branch);

    const address = makeAddress({
      subscriptionId: subscription.id,
    });
    addressesRepository.items.push(address);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      branchId: branch.id.toString(),
      addressId: address.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(branchesRepository.items[0].addressId).toEqual(address.id);
  });
});
