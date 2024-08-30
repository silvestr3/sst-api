import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { FakeDepartmentsRepository } from 'test/repositories/fake-departments-repository';
import { makeGroup } from 'test/factories/make-group';
import { CreateDepartmentUseCase } from '../create-department';
import { makeEmployer } from 'test/factories/make-employer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

describe('Create department tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let employersRepository: FakeEmployersRepository;
  let departmentsRepository: FakeDepartmentsRepository;
  let sut: CreateDepartmentUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    employersRepository = new FakeEmployersRepository();
    departmentsRepository = new FakeDepartmentsRepository();

    sut = new CreateDepartmentUseCase(
      subscriptionsRepository,
      employersRepository,
      departmentsRepository,
    );
  });

  it('Should be able to create a new department', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
      name: 'Marketing',
      description: 'Marketing department',
    });

    expect(result.isRight()).toBeTruthy();
    expect(departmentsRepository.items[0]).toEqual(
      expect.objectContaining({
        employerId: employer.id,
        name: 'Marketing',
      }),
    );
  });

  it('Should not be able to create a new department in another subscriptions employer', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer();
    employersRepository.items.push(employer);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
      name: 'Marketing',
      description: 'Marketing department',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('Should not be able to create a new department in unexisting employer', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: 'employer-id',
      name: 'Marketing',
      description: 'Marketing department',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
