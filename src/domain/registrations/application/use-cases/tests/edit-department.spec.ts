import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { FakeDepartmentsRepository } from 'test/repositories/fake-departments-repository';
import { makeGroup } from 'test/factories/make-group';
import { CreateDepartmentUseCase } from '../create-department';
import { makeEmployer } from 'test/factories/make-employer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { EditDepartmentUseCase } from '../edit-department';
import { makeDepartment } from 'test/factories/make-department';

describe('Edit department tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let departmentsRepository: FakeDepartmentsRepository;
  let sut: EditDepartmentUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    departmentsRepository = new FakeDepartmentsRepository();

    sut = new EditDepartmentUseCase(
      subscriptionsRepository,
      departmentsRepository,
    );
  });

  it('Should be able to edit a department', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const department = makeDepartment({
      subscriptionId: subscription.id,
      description: 'First department description',
    });
    departmentsRepository.items.push(department);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      departmentId: department.id.toString(),
      description: 'Edited department description',
    });

    expect(result.isRight()).toBeTruthy();
    expect(departmentsRepository.items[0]).toEqual(
      expect.objectContaining({
        description: 'Edited department description',
        name: expect.any(String),
      }),
    );
  });
});
