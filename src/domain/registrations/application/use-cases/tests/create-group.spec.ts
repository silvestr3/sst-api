import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { CreateGroupUseCase } from '../create-group';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

describe('Create group tests', () => {
  let groupsRepository: FakeGroupsRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let sut: CreateGroupUseCase;

  beforeEach(() => {
    groupsRepository = new FakeGroupsRepository();
    subscriptionsRepository = new FakeSubscriptionsRepository();

    sut = new CreateGroupUseCase(groupsRepository, subscriptionsRepository);
  });

  it('Should be able to create a new group', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      name: 'First group',
      executorId: subscription.administratorId.toString(),
      description: 'This is the first group',
    });

    expect(result.isRight()).toBeTruthy();
    expect(groupsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'First group',
        description: 'This is the first group',
      }),
    );
  });

  it('Should not be able to create group on unexisting subscription', async () => {
    const result = await sut.execute({
      subscriptionId: 'subscription-id',
      name: 'First group',
      executorId: 'executor-id',
      description: 'This is the first group',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('Should not be able to create group on another users subscription', async () => {
    const subscription = makeSubscription({
      administratorId: new UniqueEntityID('random-admin'),
    });
    subscriptionsRepository.items.push(subscription);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      name: 'First group',
      executorId: 'admin',
      description: 'This is the first group',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
