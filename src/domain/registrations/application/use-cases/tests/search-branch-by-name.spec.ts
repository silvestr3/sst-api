import { FakeBranchesRepository } from 'test/repositories/fake-branches-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { makeBranch } from 'test/factories/make-branch';
import { SearchBranchesByNameUseCase } from '../search-branch-by-name';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { makeGroup } from 'test/factories/make-group';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';

describe('Search branch by name tests', () => {
  let employersRepository: FakeEmployersRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let addressesRepository: FakeAddressesRepository;
  let doctorsRepository: FakeDoctorsRepository;
  let branchesRepository: FakeBranchesRepository;

  let sut: SearchBranchesByNameUseCase;

  beforeEach(() => {
    employersRepository = new FakeEmployersRepository(
      addressesRepository,
      doctorsRepository,
    );
    subscriptionsRepository = new FakeSubscriptionsRepository();
    branchesRepository = new FakeBranchesRepository(
      addressesRepository,
      employersRepository,
    );

    sut = new SearchBranchesByNameUseCase(
      subscriptionsRepository,
      branchesRepository,
      employersRepository,
    );
  });

  it('Should be able to search branchs by branch name and employer id', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    for (let i = 0; i < 20; i++) {
      const branch = makeBranch({
        subscriptionId: subscription.id,
        name: i < 10 ? 'Return ' : 'Other',
        employerId: employer.id,
      });

      branchesRepository.items.push(branch);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
      searchTerm: 'retur',
    });

    // @ts-ignore
    const { branches } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(branches).toHaveLength(10);
  });
});
