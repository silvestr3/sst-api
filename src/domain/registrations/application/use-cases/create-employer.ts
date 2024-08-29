import { Either, left, right } from '@/core/either';
import { Group } from '../../enterprise/entities/group';
import { GroupsRepository } from '../repositories/groups-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Employer } from '../../enterprise/entities/employer';
import { EmployersRepository } from '../repositories/employers-repository';
import { MissingInformationError } from './errors/missing-information-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Branch } from '../../enterprise/entities/branch';
import { BranchesRepository } from '../repositories/branches-repository';
import { DepartmentesRepository } from '../repositories/departments-repository';
import { Department } from '../../enterprise/entities/department';

interface CreateEmployerParams {
  subscriptionId: string;
  executorId: string;
  groupId: string;
  eSocialEnrollmentType: 'CPF' | 'CNPJ';
  cpf?: string | null;
  cnpj?: string | null;
  razaoSocial: string;
  nomeFantasia: string;
  cnae: string;
  activity: string;
  riskLevel: number;
  responsibleDoctorId: string;
  isActive?: boolean;
  addressId?: string;
}

type CreateEmployerResponse = Either<
  NotAllowedError | MissingInformationError,
  { employer: Employer }
>;

export class CreateEmployerUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
    private employersRepository: EmployersRepository,
    private branchesRepository: BranchesRepository,
    private departmentsRepository: DepartmentesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    groupId,
    eSocialEnrollmentType,
    cpf,
    cnpj,
    razaoSocial,
    nomeFantasia,
    cnae,
    activity,
    riskLevel,
    responsibleDoctorId,
    isActive = true,
    addressId,
  }: CreateEmployerParams): Promise<CreateEmployerResponse> {
    const subscription =
      await this.subscriptionsRepository.findById(subscriptionId);

    if (
      !subscription ||
      subscription.administratorId.toString() !== executorId
    ) {
      return left(new NotAllowedError());
    }

    const group = await this.groupsRepository.findById(groupId);

    if (!group || !group.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    if (eSocialEnrollmentType === 'CPF' && !cpf) {
      return left(new MissingInformationError('cpf'));
    } else if (eSocialEnrollmentType === 'CNPJ' && !cnpj) {
      return left(new MissingInformationError('cnpj'));
    }

    const employer = Employer.create({
      subscriptionId: subscription.id,
      groupId: group.id,
      eSocialEnrollmentType,
      cpf,
      cnpj,
      razaoSocial,
      nomeFantasia,
      cnae,
      activity,
      riskLevel,
      responsibleDoctorId: new UniqueEntityID(responsibleDoctorId),
      isActive,
      addressId: new UniqueEntityID(addressId),
    });

    await this.employersRepository.create(employer);

    // CREATE HEAD OFFICE BRANCH
    const branch = Branch.create({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'SEDE',
    });

    await this.branchesRepository.create(branch);

    // CREATE MAIN DEPARTMENT
    const department = Department.create({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Geral',
      description: 'Setor geral',
    });

    await this.departmentsRepository.create(department);

    return right({ employer });
  }
}
