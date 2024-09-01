import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeDepartment } from 'test/factories/make-department';
import { FakeBranchesRepository } from 'test/repositories/fake-branches-repository';
import { FetchBranchesByEmployerIdUseCase } from '../fetch-branches-by-employer-id';
import { makeBranch } from 'test/factories/make-branch';

describe('Fetch branches by employer id tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let branchesRepository: FakeBranchesRepository;
  let employersRepository: FakeEmployersRepository;
  let sut: FetchBranchesByEmployerIdUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    branchesRepository = new FakeBranchesRepository();
    employersRepository = new FakeEmployersRepository();

    sut = new FetchBranchesByEmployerIdUseCase(
      subscriptionsRepository,
      branchesRepository,
      employersRepository,
    );
  });

  it('Should be able to fetch all branches from an employer', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    for (let i = 0; i < 20; i++) {
      const branch = makeBranch({
        subscriptionId: subscription.id,
        employerId: i < 10 ? employer.id : new UniqueEntityID('other-employer'),
      });

      branchesRepository.items.push(branch);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
    });

    // @ts-ignore
    const { branches } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(branches).toHaveLength(10);
  });

  it("Should not be able to fetch branches from another subscription's employer", async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer();
    employersRepository.items.push(employer);

    for (let i = 0; i < 20; i++) {
      const branch = makeBranch({
        employerId: i < 10 ? employer.id : new UniqueEntityID('other-employer'),
      });

      branchesRepository.items.push(branch);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
