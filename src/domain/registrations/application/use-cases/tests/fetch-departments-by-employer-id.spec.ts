import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { makeGroup } from 'test/factories/make-group';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchEmployersByGroupIdUseCase } from '../fetch-employers-by-group-id';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { FetchDepartmentsByEmployerIdUseCase } from '../fetch-departments-by-employer-id';
import { FakeDepartmentsRepository } from 'test/repositories/fake-departments-repository';
import { makeDepartment } from 'test/factories/make-department';

describe('Fetch departments by employer id tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let departmentsRepository: FakeDepartmentsRepository;
  let employersRepository: FakeEmployersRepository;
  let sut: FetchDepartmentsByEmployerIdUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    departmentsRepository = new FakeDepartmentsRepository();
    employersRepository = new FakeEmployersRepository();

    sut = new FetchDepartmentsByEmployerIdUseCase(
      subscriptionsRepository,
      departmentsRepository,
      employersRepository,
    );
  });

  it('Should be able to fetch all departments from an employer', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    for (let i = 0; i < 20; i++) {
      const department = makeDepartment({
        subscriptionId: subscription.id,
        employerId: i < 10 ? employer.id : new UniqueEntityID('other-employer'),
      });

      departmentsRepository.items.push(department);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
    });

    // @ts-ignore
    const { departments } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(departments).toHaveLength(10);
  });

  it("Should not be able to fetch departments from another subscription's employer", async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer();
    employersRepository.items.push(employer);

    for (let i = 0; i < 20; i++) {
      const department = makeDepartment({
        employerId: i < 10 ? employer.id : new UniqueEntityID('other-employer'),
      });

      departmentsRepository.items.push(department);
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
