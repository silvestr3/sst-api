import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { makeGroup } from 'test/factories/make-group';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchAllGroupsUseCase } from './fetch-all-groups';

describe('Fetch all groups tests', () => {
  let groupsRepository: FakeGroupsRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let sut: FetchAllGroupsUseCase;

  beforeEach(() => {
    groupsRepository = new FakeGroupsRepository();
    subscriptionsRepository = new FakeSubscriptionsRepository();

    sut = new FetchAllGroupsUseCase(groupsRepository, subscriptionsRepository);
  });

  it('Should be able to fetch all groups from a subscription', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    for (let i = 0; i < 20; i++) {
      const group = makeGroup({
        subscriptionId:
          i < 10 ? subscription.id : new UniqueEntityID('other-subscription'),
      });

      groupsRepository.items.push(group);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
    });

    // @ts-ignore
    const { groups } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(groups).toHaveLength(10);
  });
});
