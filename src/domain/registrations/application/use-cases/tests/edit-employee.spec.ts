import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakeEmployeesRepository } from 'test/repositories/fake-employees-repository';
import { EditEmployeeUseCase } from '../edit-employee';
import { makeEmployee } from 'test/factories/make-employee';

describe('Edit employee tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let employeesRepository: FakeEmployeesRepository;

  let sut: EditEmployeeUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    employeesRepository = new FakeEmployeesRepository();

    sut = new EditEmployeeUseCase(subscriptionsRepository, employeesRepository);
  });

  it('Should be able to edit an employee', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employee = makeEmployee({
      subscriptionId: subscription.id,
      name: 'John Doe',
    });
    employeesRepository.items.push(employee);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employeeId: employee.id.toString(),
      name: 'John Edo',
    });

    expect(result.isRight()).toBeTruthy();
    expect(employeesRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Edo',
        status: 'ACTIVE',
        cpf: employee.cpf,
      }),
    );
  });
});
