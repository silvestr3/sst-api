import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { makeGroup } from 'test/factories/make-group';
import { FetchAllGroupsUseCase } from '../fetch-all-groups';
import { SearchGroupsByNameUseCase } from '../search-group-by-name';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

describe('Search group by name tests', () => {
  let groupsRepository: FakeGroupsRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let sut: SearchGroupsByNameUseCase;

  beforeEach(() => {
    groupsRepository = new FakeGroupsRepository();
    subscriptionsRepository = new FakeSubscriptionsRepository();

    sut = new SearchGroupsByNameUseCase(
      groupsRepository,
      subscriptionsRepository,
    );
  });

  it('Should be able to search groups by group name', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    for (let i = 0; i < 20; i++) {
      const group = makeGroup({
        subscriptionId: subscription.id,
        name: i < 10 ? 'Return ' : 'Other',
      });

      groupsRepository.items.push(group);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      searchTerm: 'retur',
    });

    // @ts-ignore
    const { groups } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(groups).toHaveLength(10);
  });

  it('Should not be able to search groups from other subscription', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    for (let i = 0; i < 20; i++) {
      const group = makeGroup({
        subscriptionId: new UniqueEntityID('random'),
        name: i < 10 ? 'Return ' : 'Other',
      });

      groupsRepository.items.push(group);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      searchTerm: 'retur',
    });

    // @ts-ignore
    const { groups } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(groups).toHaveLength(0);
  });
});
