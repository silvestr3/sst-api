import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { makeDoctor } from 'test/factories/make-doctor';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { SearchDoctorsByNameUseCase } from '../search-doctors-by-name';

describe('Search doctor by name tests', () => {
  let doctorsRepository: FakeDoctorsRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let sut: SearchDoctorsByNameUseCase;

  beforeEach(() => {
    doctorsRepository = new FakeDoctorsRepository();
    subscriptionsRepository = new FakeSubscriptionsRepository();

    sut = new SearchDoctorsByNameUseCase(
      doctorsRepository,
      subscriptionsRepository,
    );
  });

  it('Should be able to search doctors by doctor name', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    for (let i = 0; i < 20; i++) {
      const doctor = makeDoctor({
        subscriptionId: subscription.id,
        name: i < 10 ? 'Return ' : 'Other',
      });

      doctorsRepository.items.push(doctor);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      searchTerm: 'retur',
    });

    // @ts-ignore
    const { doctors } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(doctors).toHaveLength(10);
  });

  it('Should not be able to search doctors from other subscription', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    for (let i = 0; i < 20; i++) {
      const doctor = makeDoctor({
        subscriptionId: new UniqueEntityID('random'),
        name: i < 10 ? 'Return ' : 'Other',
      });

      doctorsRepository.items.push(doctor);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      searchTerm: 'retur',
    });

    // @ts-ignore
    const { doctors } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(doctors).toHaveLength(0);
  });
});
