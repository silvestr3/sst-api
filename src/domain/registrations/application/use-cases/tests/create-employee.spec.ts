import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { CreateEmployeeUseCase } from '../create-employee';
import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { FakeBranchesRepository } from 'test/repositories/fake-branches-repository';
import { FakeDepartmentsRepository } from 'test/repositories/fake-departments-repository';
import { FakePositionsRepository } from 'test/repositories/fake-positions-repository';
import { FakeEmployeesRepository } from 'test/repositories/fake-employees-repository';
import { makeGroup } from 'test/factories/make-group';
import { makeEmployer } from 'test/factories/make-employer';
import { makeBranch } from 'test/factories/make-branch';
import { makeDepartment } from 'test/factories/make-department';
import { makePosition } from 'test/factories/make-position';
import { Cpf } from '@/domain/registrations/enterprise/entities/value-objects/cpf';
import { MissingInformationError } from '../errors/missing-information-error';
import { InvalidInformationError } from '../errors/invalid-information-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { ConflictInformationError } from '../errors/conflict-information-error';

describe('Create employee tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let groupsRepository: FakeGroupsRepository;
  let employersRepository: FakeEmployersRepository;
  let branchesRepository: FakeBranchesRepository;
  let departmentsRepository: FakeDepartmentsRepository;
  let positionsRepository: FakePositionsRepository;
  let employeesRepository: FakeEmployeesRepository;

  let sut: CreateEmployeeUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    groupsRepository = new FakeGroupsRepository();
    employersRepository = new FakeEmployersRepository();
    branchesRepository = new FakeBranchesRepository();
    departmentsRepository = new FakeDepartmentsRepository();
    positionsRepository = new FakePositionsRepository();
    employeesRepository = new FakeEmployeesRepository();

    sut = new CreateEmployeeUseCase(
      subscriptionsRepository,
      groupsRepository,
      employersRepository,
      branchesRepository,
      departmentsRepository,
      positionsRepository,
      employeesRepository,
    );
  });

  it('Should be able to create a new employee', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      subscriptionId: subscription.id,
    });
    groupsRepository.items.push(group);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
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

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      groupId: group.id.toString(),
      employerId: employer.id.toString(),
      branchId: branch.id.toString(),
      departmentId: department.id.toString(),
      positionId: position.id.toString(),
      name: 'John Doe',
      cpf: '83027572091',
      admissionDate: new Date(),
      birthDate: new Date('December 15, 1998'),
      hasEmploymentRelationship: true,
      registration: '123123',
      gender: 'MALE',
      email: 'johndoe@email.com',
    });

    expect(result.isRight()).toBeTruthy();
    expect(employeesRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        status: 'ACTIVE',
        cpf: Cpf.validateAndCreate('83027572091'),
      }),
    );
  });

  it('Should not be able to create a new employee without registration if they have employment relationship', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      subscriptionId: subscription.id,
    });
    groupsRepository.items.push(group);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
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

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      groupId: group.id.toString(),
      employerId: employer.id.toString(),
      branchId: branch.id.toString(),
      departmentId: department.id.toString(),
      positionId: position.id.toString(),
      name: 'John Doe',
      cpf: '83027572091',
      admissionDate: new Date(),
      birthDate: new Date('December 15, 1998'),
      hasEmploymentRelationship: true,
      gender: 'MALE',
      email: 'johndoe@email.com',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(MissingInformationError);
  });

  it('Should not be able to create a new employee with invalid cpf', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      subscriptionId: subscription.id,
    });
    groupsRepository.items.push(group);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
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

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      groupId: group.id.toString(),
      employerId: employer.id.toString(),
      branchId: branch.id.toString(),
      departmentId: department.id.toString(),
      positionId: position.id.toString(),
      name: 'John Doe',
      cpf: '12312312312',
      admissionDate: new Date(),
      birthDate: new Date('December 15, 1998'),
      hasEmploymentRelationship: false,
      gender: 'MALE',
      email: 'johndoe@email.com',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidInformationError);
  });

  it('Should not be able to create a new employee without existing position', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      subscriptionId: subscription.id,
    });
    groupsRepository.items.push(group);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
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

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      groupId: group.id.toString(),
      employerId: employer.id.toString(),
      branchId: branch.id.toString(),
      departmentId: department.id.toString(),
      positionId: 'random-position',
      name: 'John Doe',
      cpf: '83027572091',
      admissionDate: new Date(),
      birthDate: new Date('December 15, 1998'),
      hasEmploymentRelationship: true,
      gender: 'MALE',
      email: 'johndoe@email.com',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('Should not be able to create a new employee if position belongs to another employer', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      subscriptionId: subscription.id,
    });
    groupsRepository.items.push(group);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
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
    });
    positionsRepository.items.push(position);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      groupId: group.id.toString(),
      employerId: employer.id.toString(),
      branchId: branch.id.toString(),
      departmentId: department.id.toString(),
      positionId: position.id.toString(),
      name: 'John Doe',
      cpf: '83027572091',
      admissionDate: new Date(),
      birthDate: new Date('December 15, 1998'),
      hasEmploymentRelationship: false,
      gender: 'MALE',
      email: 'johndoe@email.com',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ConflictInformationError);
  });
});
