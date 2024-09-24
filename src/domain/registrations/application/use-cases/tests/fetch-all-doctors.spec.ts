import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { makeDoctor } from 'test/factories/make-doctor';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchAllDoctorsUseCase } from '../fetch-all-doctors';

describe('Fetch all doctors tests', () => {
  let doctorsRepository: FakeDoctorsRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let sut: FetchAllDoctorsUseCase;

  beforeEach(() => {
    doctorsRepository = new FakeDoctorsRepository();
    subscriptionsRepository = new FakeSubscriptionsRepository();

    sut = new FetchAllDoctorsUseCase(
      doctorsRepository,
      subscriptionsRepository,
    );
  });

  it('Should be able to fetch all doctors from a subscription', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    for (let i = 0; i < 20; i++) {
      const doctor = makeDoctor({
        subscriptionId:
          i < 10 ? subscription.id : new UniqueEntityID('other-subscription'),
      });

      doctorsRepository.items.push(doctor);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
    });

    // @ts-ignore
    const { doctors } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(doctors).toHaveLength(10);
  });
});
