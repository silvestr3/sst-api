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
import { Address } from '../../enterprise/entities/address';
import { AddressesRepository } from '../repositories/addresses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Cpf } from '../../enterprise/entities/value-objects/cpf';
import { InvalidInformationError } from './errors/invalid-information-error';
import { Injectable } from '@nestjs/common';

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
  isActive?: boolean;
  addressId?: string;
}

type CreateEmployerResponse = Either<
  | NotAllowedError
  | MissingInformationError
  | InvalidInformationError
  | ResourceNotFoundError,
  { employer: Employer }
>;

@Injectable()
export class CreateEmployerUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
    private employersRepository: EmployersRepository,
    private branchesRepository: BranchesRepository,
    private departmentsRepository: DepartmentesRepository,
    private addressesRepository: AddressesRepository,
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
    isActive = true,
    addressId,
  }: CreateEmployerParams): Promise<CreateEmployerResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const getGroup = await validateResourceOwnership<Group>({
      repository: this.groupsRepository,
      resourceId: groupId,
      subscriptionId: subscription.id,
    });

    if (getGroup.isLeft()) {
      return left(getGroup.value);
    }

    const group = getGroup.value;

    let validatedCpf: Cpf;

    if (eSocialEnrollmentType === 'CPF') {
      if (!cpf) {
        return left(new MissingInformationError('cpf'));
      }

      validatedCpf = Cpf.validateAndCreate(cpf);

      if (!validatedCpf) {
        return left(new InvalidInformationError('cpf'));
      }
    } else if (eSocialEnrollmentType === 'CNPJ' && !cnpj) {
      return left(new MissingInformationError('cnpj'));
    }

    let address: Address;

    if (addressId) {
      const getAddress = await validateResourceOwnership<Address>({
        repository: this.addressesRepository,
        resourceId: addressId,
        subscriptionId: subscription.id,
      });

      if (getAddress.isLeft()) {
        return left(getAddress.value);
      }

      address = getAddress.value;
    }

    const employer = Employer.create({
      subscriptionId: subscription.id,
      groupId: group.id,
      eSocialEnrollmentType,
      cpf: validatedCpf,
      cnpj,
      razaoSocial,
      nomeFantasia,
      cnae,
      activity,
      riskLevel,
      isActive,
      addressId: address ? address.id : null,
    });

    await this.employersRepository.create(employer);

    // CREATE HEAD OFFICE BRANCH
    const branch = Branch.create({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Sede',
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
