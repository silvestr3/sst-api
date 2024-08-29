import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { EditGroupUseCase } from '../edit-group';
import { makeGroup } from 'test/factories/make-group';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

describe('Edit group tests', () => {
  let groupsRepository: FakeGroupsRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let sut: EditGroupUseCase;

  beforeEach(() => {
    groupsRepository = new FakeGroupsRepository();
    subscriptionsRepository = new FakeSubscriptionsRepository();

    sut = new EditGroupUseCase(groupsRepository, subscriptionsRepository);
  });

  it('Should be able to edit a group', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      subscriptionId: subscription.id,
      name: 'First group',
    });
    groupsRepository.items.push(group);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      groupId: group.id.toString(),
      executorId: subscription.administratorId.toString(),
      name: 'Edited group name',
    });

    expect(result.isRight()).toBeTruthy();
    expect(groupsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'Edited group name',
      }),
    );
  });

  it('Should not be able to edit a group from another subscription', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      name: 'First group',
    });
    groupsRepository.items.push(group);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      groupId: group.id.toString(),
      executorId: subscription.administratorId.toString(),
      name: 'Edited group name',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
