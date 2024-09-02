import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';
import { Employee } from '../../enterprise/entities/employee';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Group } from '../../enterprise/entities/group';
import { GroupsRepository } from '../repositories/groups-repository';
import { EmployersRepository } from '../repositories/employers-repository';
import { BranchesRepository } from '../repositories/branches-repository';
import { DepartmentesRepository } from '../repositories/departments-repository';
import { PositionsRepository } from '../repositories/positions-repository';
import { EmployeesRepository } from '../repositories/employees-repository';
import { Employer } from '../../enterprise/entities/employer';
import { Branch } from '../../enterprise/entities/branch';
import { Department } from '../../enterprise/entities/department';
import { Position } from '../../enterprise/entities/position';
import { Cpf } from '../../enterprise/entities/value-objects/cpf';
import { InvalidInformationError } from './errors/invalid-information-error';
import { MissingInformationError } from './errors/missing-information-error';
import { ConflictInformationError } from './errors/conflict-information-error';

interface CreateEmployeeParams {
  subscriptionId: string;
  executorId: string;
  groupId: string;
  employerId: string;
  branchId: string;
  departmentId: string;
  positionId: string;
  name: string;
  cpf: string;
  admissionDate: Date;
  birthDate: Date;
  hasEmploymentRelationship: boolean;
  registration?: string;
  gender: 'MALE' | 'FEMALE';
  email: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'VACATIONS' | 'REMOVED';
}

type CreateEmployeeResponse = Either<
  | NotAllowedError
  | ResourceNotFoundError
  | InvalidInformationError
  | ConflictInformationError,
  { employee: Employee }
>;

export class CreateEmployeeUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private groupsRepository: GroupsRepository,
    private employersRepository: EmployersRepository,
    private branchesRepository: BranchesRepository,
    private departmentsRepository: DepartmentesRepository,
    private positionsRepository: PositionsRepository,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    groupId,
    employerId,
    branchId,
    departmentId,
    positionId,
    name,
    cpf,
    admissionDate,
    birthDate,
    hasEmploymentRelationship,
    registration,
    gender,
    email,
    status = 'ACTIVE',
  }: CreateEmployeeParams): Promise<CreateEmployeeResponse> {
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

    const getEmployer = await validateResourceOwnership<Employer>({
      repository: this.employersRepository,
      resourceId: employerId,
      subscriptionId: subscription.id,
    });

    if (getEmployer.isLeft()) {
      return left(getEmployer.value);
    }

    const getBranch = await validateResourceOwnership<Branch>({
      repository: this.branchesRepository,
      resourceId: branchId,
      subscriptionId: subscription.id,
    });

    if (getBranch.isLeft()) {
      return left(getBranch.value);
    }

    const getDepartment = await validateResourceOwnership<Department>({
      repository: this.departmentsRepository,
      resourceId: departmentId,
      subscriptionId: subscription.id,
    });

    if (getDepartment.isLeft()) {
      return left(getDepartment.value);
    }

    const getPosition = await validateResourceOwnership<Position>({
      repository: this.positionsRepository,
      resourceId: positionId,
      subscriptionId: subscription.id,
    });

    if (getPosition.isLeft()) {
      return left(getPosition.value);
    }

    const group = getGroup.value;
    const employer = getEmployer.value;
    const branch = getBranch.value;
    const department = getDepartment.value;
    const position = getPosition.value;

    if (
      [branch.employerId, department.employerId, position.employerId].some(
        (resourceEmployer) => !resourceEmployer.equals(employer.id),
      )
    ) {
      return left(new ConflictInformationError());
    }

    const validatedCPF = Cpf.validateAndCreate(cpf);

    if (!validatedCPF) {
      return left(new InvalidInformationError('CPF'));
    }

    if (hasEmploymentRelationship && !registration) {
      return left(new MissingInformationError('Matrícula'));
    }

    const employee = Employee.create({
      subscriptionId: subscription.id,
      groupId: group.id,
      employerId: employer.id,
      branchId: branch.id,
      departmentId: department.id,
      positionId: position.id,
      name,
      cpf: validatedCPF,
      admissionDate,
      birthDate,
      hasEmploymentRelationship,
      registration,
      gender,
      email,
      status,
    });

    await this.employeesRepository.create(employee);

    return right({ employee });
  }
}
