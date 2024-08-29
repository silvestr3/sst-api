import { FakeGroupsRepository } from 'test/repositories/fake-groups-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { CreateEmployerUseCase } from '../create-employer';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { FakeBranchesRepository } from 'test/repositories/fake-branches-repository';
import { FakeDepartmentsRepository } from 'test/repositories/fake-departments-repository';
import { makeGroup } from 'test/factories/make-group';
import { MissingInformationError } from '../errors/missing-information-error';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';

describe('Create employer tests', () => {
  let groupsRepository: FakeGroupsRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let employersRepository: FakeEmployersRepository;
  let branchesRepository: FakeBranchesRepository;
  let departmentsRepository: FakeDepartmentsRepository;
  let sut: CreateEmployerUseCase;
  let addressesRepository: FakeAddressesRepository;

  beforeEach(() => {
    groupsRepository = new FakeGroupsRepository();
    subscriptionsRepository = new FakeSubscriptionsRepository();
    employersRepository = new FakeEmployersRepository();
    branchesRepository = new FakeBranchesRepository();
    departmentsRepository = new FakeDepartmentsRepository();
    addressesRepository = new FakeAddressesRepository();

    sut = new CreateEmployerUseCase(
      groupsRepository,
      subscriptionsRepository,
      employersRepository,
      branchesRepository,
      departmentsRepository,
      addressesRepository,
    );
  });

  it('Should be able to create a new employer and default branch and department', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      subscriptionId: subscription.id,
    });
    groupsRepository.items.push(group);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      groupId: group.id.toString(),
      executorId: subscription.administratorId.toString(),
      razaoSocial: 'Test employer',
      nomeFantasia: 'Test employer',
      cnae: '12321',
      activity: 'Production of unit tests',
      riskLevel: 1,
      eSocialEnrollmentType: 'CPF',
      cpf: '12312312312',
      responsibleDoctorId: 'doctor-id',
    });

    //@ts-ignore
    const { employer } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(employersRepository.items[0]).toEqual(
      expect.objectContaining({
        subscriptionId: subscription.id,
        groupId: group.id,
        razaoSocial: 'Test employer',
        nomeFantasia: 'Test employer',
      }),
    );
    expect(branchesRepository.items[0]).toEqual(
      expect.objectContaining({
        employerId: employer.id,
        subscriptionId: subscription.id,
        name: 'SEDE',
      }),
    );
    expect(departmentsRepository.items[0]).toEqual(
      expect.objectContaining({
        employerId: employer.id,
        subscriptionId: subscription.id,
        name: 'Geral',
        description: 'Setor geral',
      }),
    );
  });

  it('Should not be able to create employer without correct enrollment document', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const group = makeGroup({
      subscriptionId: subscription.id,
    });
    groupsRepository.items.push(group);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      groupId: group.id.toString(),
      executorId: subscription.administratorId.toString(),
      razaoSocial: 'Test employer',
      nomeFantasia: 'Test employer',
      cnae: '12321',
      activity: 'Production of unit tests',
      riskLevel: 1,
      eSocialEnrollmentType: 'CPF',
      cnpj: '12312312312',
      responsibleDoctorId: 'doctor-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(MissingInformationError);
  });
});
