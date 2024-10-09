import { FakeEmployeesRepository } from 'test/repositories/fake-employees-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { makeEmployee } from 'test/factories/make-employee';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { FakeBranchesRepository } from 'test/repositories/fake-branches-repository';
import { FakeDepartmentsRepository } from 'test/repositories/fake-departments-repository';
import { FakePositionsRepository } from 'test/repositories/fake-positions-repository';
import { SearchEmployeesByNameUseCase } from '../search-employees-by-name';

describe('Search employee by name tests', () => {
  let employersRepository: FakeEmployersRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let addressesRepository: FakeAddressesRepository;
  let doctorsRepository: FakeDoctorsRepository;
  let employeesRepository: FakeEmployeesRepository;
  let branchesRepository: FakeBranchesRepository;
  let departmentsRepository: FakeDepartmentsRepository;
  let positionsRepository: FakePositionsRepository;

  let sut: SearchEmployeesByNameUseCase;

  beforeEach(() => {
    employersRepository = new FakeEmployersRepository(
      addressesRepository,
      doctorsRepository,
    );
    subscriptionsRepository = new FakeSubscriptionsRepository();
    employeesRepository = new FakeEmployeesRepository(
      employersRepository,
      branchesRepository,
      departmentsRepository,
      positionsRepository,
    );

    sut = new SearchEmployeesByNameUseCase(
      subscriptionsRepository,
      employeesRepository,
      employersRepository,
    );
  });

  it('Should be able to search employees by employee name and employer id', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    for (let i = 0; i < 20; i++) {
      const employee = makeEmployee({
        subscriptionId: subscription.id,
        name: i < 10 ? 'Return ' : 'Other',
        employerId: employer.id,
      });

      employeesRepository.items.push(employee);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
      searchTerm: 'retur',
    });

    // @ts-ignore
    const { employees } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(employees).toHaveLength(10);
  });
});
