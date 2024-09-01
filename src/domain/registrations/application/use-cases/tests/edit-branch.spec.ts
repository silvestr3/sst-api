import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakeBranchesRepository } from 'test/repositories/fake-branches-repository';
import { EditBranchUseCase } from '../edit-branch';
import { makeBranch } from 'test/factories/make-branch';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

describe('Edit branch tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let branchesRepository: FakeBranchesRepository;
  let sut: EditBranchUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    branchesRepository = new FakeBranchesRepository();

    sut = new EditBranchUseCase(subscriptionsRepository, branchesRepository);
  });

  it('Should be able to edit a branch', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const branch = makeBranch({
      subscriptionId: subscription.id,
      name: 'New Branch',
    });
    branchesRepository.items.push(branch);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      branchId: branch.id.toString(),
      name: 'Edited branch name',
    });

    expect(result.isRight()).toBeTruthy();
    expect(branchesRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'Edited branch name',
      }),
    );
  });

  it('Should not be able to edit another subscriptions branch', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const branch = makeBranch({
      name: 'New Branch',
    });
    branchesRepository.items.push(branch);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      branchId: branch.id.toString(),
      name: 'Edited branch name',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
