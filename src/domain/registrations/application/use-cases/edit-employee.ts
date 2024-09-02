import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';
import { Employee } from '../../enterprise/entities/employee';
import { EmployeesRepository } from '../repositories/employees-repository';
import { InvalidInformationError } from './errors/invalid-information-error';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Cpf } from '../../enterprise/entities/value-objects/cpf';
import { MissingInformationError } from './errors/missing-information-error';

interface EditEmployeeParams {
  subscriptionId: string;
  executorId: string;
  employeeId: string;
  name?: string;
  cpf?: string;
  admissionDate?: Date;
  birthDate?: Date;
  hasEmploymentRelationship?: boolean;
  registration?: string;
  gender?: 'MALE' | 'FEMALE';
  email?: string;
}

type EditEmployeeResponse = Either<
  | NotAllowedError
  | ResourceNotFoundError
  | InvalidInformationError
  | MissingInformationError,
  { employee: Employee }
>;

export class EditEmployeeUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employeeId,
    name,
    cpf,
    admissionDate,
    birthDate,
    hasEmploymentRelationship,
    registration,
    gender,
    email,
  }: EditEmployeeParams): Promise<EditEmployeeResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const getEmployee = await validateResourceOwnership<Employee>({
      repository: this.employeesRepository,
      resourceId: employeeId,
      subscriptionId: subscription.id,
    });

    if (getEmployee.isLeft()) {
      return left(getEmployee.value);
    }

    let validatedCPF: Cpf;
    if (cpf) {
      validatedCPF = Cpf.validateAndCreate(cpf);
      if (!validatedCPF) {
        return left(new InvalidInformationError('CPF'));
      }
    }

    if (hasEmploymentRelationship && !registration) {
      return left(new MissingInformationError('Matrícula'));
    }

    const employee = getEmployee.value;

    employee.name = name ?? employee.name;
    employee.cpf = validatedCPF ?? employee.cpf;
    employee.admissionDate = admissionDate ?? employee.admissionDate;
    employee.birthDate = birthDate ?? employee.birthDate;
    employee.hasEmploymentRelationship =
      hasEmploymentRelationship ?? employee.hasEmploymentRelationship;
    employee.registration = registration ?? employee.registration;
    employee.gender = gender ?? employee.gender;
    employee.email = email ?? employee.email;

    return right({ employee });
  }
}
