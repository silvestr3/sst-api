import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { makeEmployer } from 'test/factories/make-employer';
import { SearchEmployersByNameUseCase } from '../search-employer-by-name';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { makeGroup } from 'test/factories/make-group';

describe('Search employer by name tests', () => {
  let employersRepository: FakeEmployersRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let addressesRepository: FakeAddressesRepository;
  let doctorsRepository: FakeDoctorsRepository;
  let groupsRepository: FakeGroupsRepository;
  let sut: SearchEmployersByNameUseCase;

  beforeEach(() => {
    employersRepository = new FakeEmployersRepository(
      addressesRepository,
      doctorsRepository,
    );
    subscriptionsRepository = new FakeSubscriptionsRepository();
    groupsRepository = new FakeGroupsRepository();

    sut = new SearchEmployersByNameUseCase(
      subscriptionsRepository,
      employersRepository,
      groupsRepository,
    );
  });

  it('Should be able to search employers by employer name and group id', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      subscriptionId: subscription.id,
    });
    groupsRepository.items.push(group);

    for (let i = 0; i < 20; i++) {
      const employer = makeEmployer({
        subscriptionId: subscription.id,
        nomeFantasia: i < 10 ? 'Return ' : 'Other',
        groupId: group.id,
      });

      employersRepository.items.push(employer);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      groupId: group.id.toString(),
      searchTerm: 'retur',
    });

    // @ts-ignore
    const { employers } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(employers).toHaveLength(10);
  });

  it('Should be able to search employers only by name', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    for (let i = 0; i < 20; i++) {
      const employer = makeEmployer({
        subscriptionId: subscription.id,
        nomeFantasia: i < 10 ? 'Return ' : 'Other',
      });

      employersRepository.items.push(employer);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      searchTerm: 'retur',
    });

    // @ts-ignore
    const { employers } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(employers).toHaveLength(10);
  });

  it('Should not be able to search employers from other subscription', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    for (let i = 0; i < 20; i++) {
      const employer = makeEmployer({
        subscriptionId: new UniqueEntityID('random'),
        nomeFantasia: i < 10 ? 'Return ' : 'Other',
      });

      employersRepository.items.push(employer);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      searchTerm: 'retur',
    });

    // @ts-ignore
    const { employers } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(employers).toHaveLength(0);
  });
});
