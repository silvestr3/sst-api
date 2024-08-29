import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { makeGroup } from 'test/factories/make-group';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchAllGroupsUseCase } from '../fetch-all-groups';
import { FetchEmployersByGroupIdUseCase } from '../fetch-employers-by-group-id';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

describe('Fetch employers by group id tests', () => {
  let groupsRepository: FakeGroupsRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let employersRepository: FakeEmployersRepository;
  let sut: FetchEmployersByGroupIdUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    groupsRepository = new FakeGroupsRepository();
    employersRepository = new FakeEmployersRepository();

    sut = new FetchEmployersByGroupIdUseCase(
      subscriptionsRepository,
      groupsRepository,
      employersRepository,
    );
  });

  it('Should be able to fetch all groups from a group', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      subscriptionId: subscription.id,
    });
    groupsRepository.items.push(group);

    for (let i = 0; i < 20; i++) {
      const employer = makeEmployer({
        subscriptionId: subscription.id,
        groupId: i < 10 ? group.id : new UniqueEntityID('other-group'),
      });

      employersRepository.items.push(employer);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      groupId: group.id.toString(),
    });

    // @ts-ignore
    const { employers } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(employers).toHaveLength(10);
  });

  it("Should not be able to fetch employers from another subscription's group", async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup();
    groupsRepository.items.push(group);

    for (let i = 0; i < 20; i++) {
      const employer = makeEmployer({
        groupId: i < 10 ? group.id : new UniqueEntityID('other-group'),
      });

      employersRepository.items.push(employer);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      groupId: group.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
