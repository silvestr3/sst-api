import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { makeAddress } from 'test/factories/make-address';
import { LinkDoctorToEmployerUseCase } from '../link-doctor-to-employer';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { makeDoctor } from 'test/factories/make-doctor';

describe('Link doctor to employer tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let employersRepository: FakeEmployersRepository;
  let doctorsRepository: FakeDoctorsRepository;
  let sut: LinkDoctorToEmployerUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    employersRepository = new FakeEmployersRepository();
    doctorsRepository = new FakeDoctorsRepository();

    sut = new LinkDoctorToEmployerUseCase(
      subscriptionsRepository,
      employersRepository,
      doctorsRepository,
    );
  });

  it('Should be able to link a doctor to employer', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    const doctor = makeDoctor({
      subscriptionId: subscription.id,
    });
    doctorsRepository.items.push(doctor);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
      doctorId: doctor.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(employersRepository.items[0].responsibleDoctorId).toEqual(doctor.id);
  });
});
