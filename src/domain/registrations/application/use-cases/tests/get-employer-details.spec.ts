import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { makeDoctor } from 'test/factories/make-doctor';
import { makeAddress } from 'test/factories/make-address';
import { GetEmployerDetailsUseCase } from '../get-employer-details';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EmployerWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/employer-with-details';

describe('get employer details tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;

  let addressesRepository: FakeAddressesRepository;
  let doctorsRepository: FakeDoctorsRepository;

  let employersRepository: FakeEmployersRepository;
  let sut: GetEmployerDetailsUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();

    addressesRepository = new FakeAddressesRepository();
    doctorsRepository = new FakeDoctorsRepository();

    employersRepository = new FakeEmployersRepository(
      addressesRepository,
      doctorsRepository,
    );

    sut = new GetEmployerDetailsUseCase(
      subscriptionsRepository,
      employersRepository,
    );
  });

  it('Should be able to find one employer with details', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const doctor = makeDoctor({
      subscriptionId: subscription.id,
    });
    doctorsRepository.items.push(doctor);

    const address = makeAddress({
      subscriptionId: subscription.id,
    });
    addressesRepository.items.push(address);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
      responsibleDoctorId: doctor.id,
      addressId: address.id,
    });
    employersRepository.items.push(employer);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();

    expect(result.value).toEqual(
      expect.objectContaining({
        employer: expect.objectContaining({
          props: expect.objectContaining({
            employerId: employer.id,
            address,
            responsibleDoctor: doctor,
          }),
        }),
      }),
    );
  });
});
