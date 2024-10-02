import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakeDepartmentsRepository } from 'test/repositories/fake-departments-repository';
import { makeDepartment } from 'test/factories/make-department';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { makeDoctor } from 'test/factories/make-doctor';
import { makeAddress } from 'test/factories/make-address';
import { GetDepartmentDetailsUseCase } from '../get-department-details';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';

describe('get department details tests', () => {
  let sut: GetDepartmentDetailsUseCase;

  let subscriptionsRepository: FakeSubscriptionsRepository;

  let addressesRepository: FakeAddressesRepository;
  let doctorsRepository: FakeDoctorsRepository;

  let departmentsRepository: FakeDepartmentsRepository;
  let employersRepository: FakeEmployersRepository;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();

    addressesRepository = new FakeAddressesRepository();
    doctorsRepository = new FakeDoctorsRepository();

    employersRepository = new FakeEmployersRepository(
      addressesRepository,
      doctorsRepository,
    );

    departmentsRepository = new FakeDepartmentsRepository(employersRepository);

    sut = new GetDepartmentDetailsUseCase(
      subscriptionsRepository,
      departmentsRepository,
    );
  });

  it('Should be able to find one department with details', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    const department = makeDepartment({
      subscriptionId: subscription.id,
      employerId: employer.id,
    });
    departmentsRepository.items.push(department);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      departmentId: department.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();

    expect(result.value).toEqual(
      expect.objectContaining({
        department: expect.objectContaining({
          props: expect.objectContaining({
            departmentId: department.id,
            employer: expect.objectContaining({
              employerId: employer.id,
            }),
          }),
        }),
      }),
    );
  });
});
