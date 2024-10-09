import { FakeDepartmentsRepository } from 'test/repositories/fake-departments-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { makeDepartment } from 'test/factories/make-department';
import { SearchDepartmentsByNameUseCase } from '../search-department-by-name';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { makeGroup } from 'test/factories/make-group';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';

describe('Search department by name tests', () => {
  let employersRepository: FakeEmployersRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let addressesRepository: FakeAddressesRepository;
  let doctorsRepository: FakeDoctorsRepository;
  let departmentsRepository: FakeDepartmentsRepository;

  let sut: SearchDepartmentsByNameUseCase;

  beforeEach(() => {
    employersRepository = new FakeEmployersRepository(
      addressesRepository,
      doctorsRepository,
    );
    subscriptionsRepository = new FakeSubscriptionsRepository();
    departmentsRepository = new FakeDepartmentsRepository(employersRepository);

    sut = new SearchDepartmentsByNameUseCase(
      subscriptionsRepository,
      departmentsRepository,
      employersRepository,
    );
  });

  it('Should be able to search departments by department name and employer id', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    for (let i = 0; i < 20; i++) {
      const department = makeDepartment({
        subscriptionId: subscription.id,
        name: i < 10 ? 'Return ' : 'Other',
        employerId: employer.id,
      });

      departmentsRepository.items.push(department);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
      searchTerm: 'retur',
    });

    // @ts-ignore
    const { departments } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(departments).toHaveLength(10);
  });
});
