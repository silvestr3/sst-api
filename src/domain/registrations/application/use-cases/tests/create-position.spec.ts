import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { CreateGroupUseCase } from '../create-group';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CreatePositionUseCase } from '../create-position';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { FakePositionsRepository } from 'test/repositories/fake-positions-repository';
import { makeEmployer } from 'test/factories/make-employer';

describe('Create position tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let employersRepository: FakeEmployersRepository;
  let positionsRepository: FakePositionsRepository;
  let sut: CreatePositionUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    employersRepository = new FakeEmployersRepository();
    positionsRepository = new FakePositionsRepository();

    sut = new CreatePositionUseCase(
      subscriptionsRepository,
      employersRepository,
      positionsRepository,
    );
  });

  it('Should be able to create a new position', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
      name: 'Manager',
      description: 'Manager description',
      cbo: '1232',
    });

    expect(result.isRight()).toBeTruthy();
    expect(positionsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'Manager',
        description: 'Manager description',
        isActive: true,
      }),
    );
  });

  it('Should not be able to create a position in another subscription employer', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer();
    employersRepository.items.push(employer);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
      name: 'Manager',
      description: 'Manager description',
      cbo: '1232',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
