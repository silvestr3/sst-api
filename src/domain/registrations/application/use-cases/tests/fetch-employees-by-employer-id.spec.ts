import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { FetchEmployeesByEmployerIdUseCase } from '../fetch-employees-by-employer-id';
import { FakeEmployeesRepository } from 'test/repositories/fake-employees-repository';
import { makeEmployee } from 'test/factories/make-employee';

describe('Fetch employees by employer id tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let employeesRepository: FakeEmployeesRepository;
  let employersRepository: FakeEmployersRepository;
  let sut: FetchEmployeesByEmployerIdUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    employeesRepository = new FakeEmployeesRepository();
    employersRepository = new FakeEmployersRepository();

    sut = new FetchEmployeesByEmployerIdUseCase(
      subscriptionsRepository,
      employeesRepository,
      employersRepository,
    );
  });

  it('Should be able to fetch all employees from an employer', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    for (let i = 0; i < 20; i++) {
      const employee = makeEmployee({
        subscriptionId: subscription.id,
        employerId: i < 10 ? employer.id : new UniqueEntityID('other-employer'),
      });

      employeesRepository.items.push(employee);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
    });

    // @ts-ignore
    const { employees } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(employees).toHaveLength(10);
  });

  it("Should not be able to fetch employees from another subscription's employer", async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer();
    employersRepository.items.push(employer);

    for (let i = 0; i < 20; i++) {
      const employee = makeEmployee({
        employerId: i < 10 ? employer.id : new UniqueEntityID('other-employer'),
      });

      employeesRepository.items.push(employee);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
