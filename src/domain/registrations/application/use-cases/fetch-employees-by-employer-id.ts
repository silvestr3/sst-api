import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Employer } from '../../enterprise/entities/employer';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Employee } from '../../enterprise/entities/employee';
import { EmployersRepository } from '../repositories/employers-repository';
import { Injectable } from '@nestjs/common';
import { EmployeesRepository } from '../repositories/employees-repository';

interface FetchEmployeesByEmployerIdParams {
  subscriptionId: string;
  executorId: string;
  employerId: string;
}

type FetchEmployeesByEmployerIdResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { employees: Employee[] }
>;

@Injectable()
export class FetchEmployeesByEmployerIdUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private employeesRepository: EmployeesRepository,
    private employersRepository: EmployersRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
  }: FetchEmployeesByEmployerIdParams): Promise<FetchEmployeesByEmployerIdResponse> {
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

    const employees = await this.employeesRepository.fetchByEmployerId(
      employer.id.toString(),
    );

    return right({ employees });
  }
}
