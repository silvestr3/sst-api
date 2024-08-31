import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { CreateDoctorUseCase } from '../create-doctor';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';

describe('Create doctor tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let doctorsRepository: FakeDoctorsRepository;
  let sut: CreateDoctorUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    doctorsRepository = new FakeDoctorsRepository();

    sut = new CreateDoctorUseCase(subscriptionsRepository, doctorsRepository);
  });

  it('Should be able to create a new doctor', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      name: 'Doctor Pico',
      crm: '12312',
      ufCrm: 'GO',
      phone: '19082731908',
    });

    expect(result.isRight()).toBeTruthy();
    expect(doctorsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'Doctor Pico',
      }),
    );
  });
});
