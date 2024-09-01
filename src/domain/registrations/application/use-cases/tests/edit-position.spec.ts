import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CreatePositionUseCase } from '../create-position';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { FakePositionsRepository } from 'test/repositories/fake-positions-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { EditPositionUseCase } from '../edit-position';
import { makePosition } from 'test/factories/make-position';

describe('Edit position tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let positionsRepository: FakePositionsRepository;
  let sut: EditPositionUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    positionsRepository = new FakePositionsRepository();

    sut = new EditPositionUseCase(subscriptionsRepository, positionsRepository);
  });

  it('Should be able to edit a position', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const position = makePosition({
      subscriptionId: subscription.id,
      name: 'Manager',
    });
    positionsRepository.items.push(position);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      positionId: position.id.toString(),
      name: 'Testing manager',
    });

    expect(result.isRight()).toBeTruthy();
    expect(positionsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'Testing manager',
      }),
    );
  });

  it('Should not be able to create a position in another subscription employer', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const position = makePosition({
      name: 'Manager',
    });
    positionsRepository.items.push(position);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      positionId: position.id.toString(),
      name: 'Testing manager',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
