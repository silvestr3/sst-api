import { Either, left, right } from '@/core/either';
import { Department } from '../../enterprise/entities/department';
import { DepartmentsRepository } from '../repositories/departments-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { EmployersRepository } from '../repositories/employers-repository';
import { Employer } from '../../enterprise/entities/employer';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface SearchDepartmentsByNameParams {
  subscriptionId: string;
  executorId: string;
  employerId?: string;
  searchTerm: string;
}

type SearchDepartmentsByNameResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { departments: Department[] }
>;

@Injectable()
export class SearchDepartmentsByNameUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private departmentsRepository: DepartmentsRepository,
    private employersRepository: EmployersRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
    searchTerm,
  }: SearchDepartmentsByNameParams): Promise<SearchDepartmentsByNameResponse> {
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

    const departments = await this.departmentsRepository.searchByName(
      subscription.id.toString(),
      employer.id.toString(),
      searchTerm,
    );

    return right({ departments });
  }
}
