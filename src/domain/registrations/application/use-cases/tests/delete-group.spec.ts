import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { DeleteGroupUseCase } from '../delete-group';
import { makeGroup } from 'test/factories/make-group';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { GroupNotEmptyError } from '../errors/group-not-empty-error';

describe('Delete group tests', () => {
  let groupsRepository: FakeGroupsRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let employersRepository: FakeEmployersRepository;
  let sut: DeleteGroupUseCase;

  beforeEach(() => {
    groupsRepository = new FakeGroupsRepository();
    subscriptionsRepository = new FakeSubscriptionsRepository();
    employersRepository = new FakeEmployersRepository();

    sut = new DeleteGroupUseCase(
      groupsRepository,
      subscriptionsRepository,
      employersRepository,
    );
  });

  it('Should be able to delete a group', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      subscriptionId: subscription.id,
    });

    groupsRepository.items.push(group);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      groupId: group.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(groupsRepository.items).toHaveLength(0);
  });

  it('Should not be able to delete another subscriptions group', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup();

    groupsRepository.items.push(group);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      groupId: group.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('Should not be able to delete unexisting group', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      groupId: 'not-existing-group',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('Should not be able to delete a group if it is not empty', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      subscriptionId: subscription.id,
    });
    groupsRepository.items.push(group);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
    });
    employersRepository.items.push(employer);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      groupId: group.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(GroupNotEmptyError);
  });
});
