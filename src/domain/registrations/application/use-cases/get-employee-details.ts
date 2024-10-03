import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { EmployeeWithDetails } from '../../enterprise/entities/value-objects/employee-with-details';
import { EmployeesRepository } from '../repositories/employees-repository';

interface GetEmployeeDetailsParams {
  subscriptionId: string;
  executorId: string;
  employeeId: string;
}

type GetEmployeeDetailsResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { employee: EmployeeWithDetails }
>;

@Injectable()
export class GetEmployeeDetailsUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employeeId,
  }: GetEmployeeDetailsParams): Promise<GetEmployeeDetailsResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const employee =
      await this.employeesRepository.findByIdWithDetails(employeeId);

    if (!employee) {
      return left(new ResourceNotFoundError());
    }

    if (!employee.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    return right({ employee });
  }
}
