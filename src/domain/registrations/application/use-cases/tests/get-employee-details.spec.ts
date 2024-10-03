import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakeEmployeesRepository } from 'test/repositories/fake-employees-repository';
import { makeEmployee } from 'test/factories/make-employee';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { GetEmployeeDetailsUseCase } from '../get-employee-details';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { FakeBranchesRepository } from 'test/repositories/fake-branches-repository';
import { FakeDepartmentsRepository } from 'test/repositories/fake-departments-repository';
import { FakePositionsRepository } from 'test/repositories/fake-positions-repository';
import { makeBranch } from 'test/factories/make-branch';
import { makeDepartment } from 'test/factories/make-department';
import { makePosition } from 'test/factories/make-position';

describe('get employee details tests', () => {
  let sut: GetEmployeeDetailsUseCase;

  let subscriptionsRepository: FakeSubscriptionsRepository;

  let addressesRepository: FakeAddressesRepository;
  let doctorsRepository: FakeDoctorsRepository;

  let branchesRepository: FakeBranchesRepository;
  let departmentsRepository: FakeDepartmentsRepository;
  let positionsRepository: FakePositionsRepository;

  let employeesRepository: FakeEmployeesRepository;
  let employersRepository: FakeEmployersRepository;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();

    addressesRepository = new FakeAddressesRepository();
    doctorsRepository = new FakeDoctorsRepository();

    employersRepository = new FakeEmployersRepository(
      addressesRepository,
      doctorsRepository,
    );

    branchesRepository = new FakeBranchesRepository(
      addressesRepository,
      employersRepository,
    );

    departmentsRepository = new FakeDepartmentsRepository(employersRepository);
    positionsRepository = new FakePositionsRepository(employersRepository);

    employeesRepository = new FakeEmployeesRepository(
      employersRepository,
      branchesRepository,
      departmentsRepository,
      positionsRepository,
    );

    sut = new GetEmployeeDetailsUseCase(
      subscriptionsRepository,
      employeesRepository,
    );
  });

  it('Should be able to find one employee with details', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    const branch = makeBranch({
      subscriptionId: subscription.id,
      employerId: employer.id,
    });
    branchesRepository.items.push(branch);

    const department = makeDepartment({
      subscriptionId: subscription.id,
      employerId: employer.id,
    });
    departmentsRepository.items.push(department);

    const position = makePosition({
      subscriptionId: subscription.id,
      employerId: employer.id,
    });
    positionsRepository.items.push(position);

    const employee = makeEmployee({
      subscriptionId: subscription.id,
      employerId: employer.id,
      branchId: branch.id,
      departmentId: department.id,
      positionId: position.id,
    });
    employeesRepository.items.push(employee);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employeeId: employee.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();

    expect(result.value).toEqual(
      expect.objectContaining({
        employee: expect.objectContaining({
          props: expect.objectContaining({
            employeeId: employee.id,
            employer: expect.objectContaining({
              employerId: employer.id,
            }),
            position: expect.objectContaining({
              positionId: position.id,
            }),
            department: expect.objectContaining({
              departmentId: department.id,
            }),
            branch: expect.objectContaining({
              branchId: branch.id,
            }),
          }),
        }),
      }),
    );
  });
});
