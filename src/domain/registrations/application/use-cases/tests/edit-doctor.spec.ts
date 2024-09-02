import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { CreateDoctorUseCase } from '../create-doctor';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { EditDoctorUseCase } from '../edit-doctor';
import { makeDoctor } from 'test/factories/make-doctor';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

describe('Edit doctor tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let doctorsRepository: FakeDoctorsRepository;
  let sut: EditDoctorUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    doctorsRepository = new FakeDoctorsRepository();

    sut = new EditDoctorUseCase(subscriptionsRepository, doctorsRepository);
  });

  it('Should be able to edit a doctor', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const doctor = makeDoctor({
      subscriptionId: subscription.id,
      name: 'Doctor Pico',
    });
    doctorsRepository.items.push(doctor);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      doctorId: doctor.id.toString(),
      name: 'Edited Doctor name',
    });

    expect(result.isRight()).toBeTruthy();
    expect(doctorsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'Edited Doctor name',
        crm: doctor.crm,
      }),
    );
  });

  it('Should not be able to edit a doctor from another subscription', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const doctor = makeDoctor({
      name: 'Doctor Pico',
    });
    doctorsRepository.items.push(doctor);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      doctorId: doctor.id.toString(),
      name: 'Edited Doctor name',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
