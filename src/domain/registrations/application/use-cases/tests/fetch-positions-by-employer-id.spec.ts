import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { FetchPositionsByEmployerIdUseCase } from '../fetch-positions-by-employer-id';
import { FakePositionsRepository } from 'test/repositories/fake-positions-repository';
import { makePosition } from 'test/factories/make-position';

describe('Fetch positions by employer id tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let positionsRepository: FakePositionsRepository;
  let employersRepository: FakeEmployersRepository;
  let sut: FetchPositionsByEmployerIdUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    positionsRepository = new FakePositionsRepository();
    employersRepository = new FakeEmployersRepository();

    sut = new FetchPositionsByEmployerIdUseCase(
      subscriptionsRepository,
      positionsRepository,
      employersRepository,
    );
  });

  it('Should be able to fetch all positions from an employer', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    for (let i = 0; i < 20; i++) {
      const position = makePosition({
        subscriptionId: subscription.id,
        employerId: i < 10 ? employer.id : new UniqueEntityID('other-employer'),
      });

      positionsRepository.items.push(position);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
    });

    // @ts-ignore
    const { positions } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(positions).toHaveLength(10);
  });

  it("Should not be able to fetch positions from another subscription's employer", async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer();
    employersRepository.items.push(employer);

    for (let i = 0; i < 20; i++) {
      const position = makePosition({
        employerId: i < 10 ? employer.id : new UniqueEntityID('other-employer'),
      });

      positionsRepository.items.push(position);
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
