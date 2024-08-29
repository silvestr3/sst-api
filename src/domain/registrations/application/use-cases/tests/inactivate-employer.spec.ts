import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { InactivateEmployerUseCase } from '../inactivate-employer';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

describe('Inactivate employer tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let employersRepository: FakeEmployersRepository;
  let sut: InactivateEmployerUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    employersRepository = new FakeEmployersRepository();

    sut = new InactivateEmployerUseCase(
      subscriptionsRepository,
      employersRepository,
    );
  });

  it('Should be able to inactivate an employer', async () => {
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
    });

    expect(result.isRight()).toBeTruthy();
    expect(employersRepository.items[0].isActive).toBeFalsy();
  });

  it('Should not be able to inactivate an employer from another subscription', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer();
    employersRepository.items.push(employer);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(employersRepository.items[0].isActive).toBeTruthy();
  });
});
