import { Either, left, right } from '@/core/either';
import { Employee } from '../../enterprise/entities/employee';
import { EmployeesRepository } from '../repositories/employees-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { EmployersRepository } from '../repositories/employers-repository';
import { Employer } from '../../enterprise/entities/employer';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface SearchEmployeesByNameParams {
  subscriptionId: string;
  executorId: string;
  employerId?: string;
  searchTerm: string;
}

type SearchEmployeesByNameResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { employees: Employee[] }
>;

@Injectable()
export class SearchEmployeesByNameUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private employeesRepository: EmployeesRepository,
    private employersRepository: EmployersRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
    searchTerm,
  }: SearchEmployeesByNameParams): Promise<SearchEmployeesByNameResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const getEmployer = await validateResourceOwnership<Employer>({
      repository: this.employersRepository,
      resourceId: employerId,
      subscriptionId: subscription.id,
    });

    if (getEmployer.isLeft()) {
      return left(getEmployer.value);
    }

    const employer = getEmployer.value;

    const employees = await this.employeesRepository.searchByName(
      subscription.id.toString(),
      employer.id.toString(),
      searchTerm,
    );

    return right({ employees });
  }
}
