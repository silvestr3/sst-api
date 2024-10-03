import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakeBranchesRepository } from 'test/repositories/fake-branches-repository';
import { makeBranch } from 'test/factories/make-branch';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { GetBranchDetailsUseCase } from '../get-branch-details';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { makeAddress } from 'test/factories/make-address';

describe('get branch details tests', () => {
  let sut: GetBranchDetailsUseCase;

  let subscriptionsRepository: FakeSubscriptionsRepository;

  let addressesRepository: FakeAddressesRepository;
  let doctorsRepository: FakeDoctorsRepository;

  let branchesRepository: FakeBranchesRepository;
  let employersRepository: FakeEmployersRepository;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();

    addressesRepository = new FakeAddressesRepository();
    doctorsRepository = new FakeDoctorsRepository();

    employersRepository = new FakeEmployersRepository(
      addressesRepository,
      doctorsRepository,
    );

    branchesRepository = new FakeBranchesRepository(
      addressesRepository,
      employersRepository,
    );

    sut = new GetBranchDetailsUseCase(
      subscriptionsRepository,
      branchesRepository,
    );
  });

  it('Should be able to find one branch with details', async () => {
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

    const branch = makeBranch({
      subscriptionId: subscription.id,
      employerId: employer.id,
      addressId: address.id,
    });
    branchesRepository.items.push(branch);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      branchId: branch.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();

    expect(result.value).toEqual(
      expect.objectContaining({
        branch: expect.objectContaining({
          props: expect.objectContaining({
            branchId: branch.id,
            employer: expect.objectContaining({
              employerId: employer.id,
            }),
            address: expect.objectContaining({
              addressId: address.id,
            }),
          }),
        }),
      }),
    );
  });
});
