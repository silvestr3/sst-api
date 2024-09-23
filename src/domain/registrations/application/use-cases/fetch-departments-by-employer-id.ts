import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Employer } from '../../enterprise/entities/employer';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { DepartmentesRepository } from '../repositories/departments-repository';
import { Department } from '../../enterprise/entities/department';
import { EmployersRepository } from '../repositories/employers-repository';
import { Injectable } from '@nestjs/common';

interface FetchDepartmentsByEmployerIdParams {
  subscriptionId: string;
  executorId: string;
  employerId: string;
}

type FetchDepartmentsByEmployerIdResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { departments: Department[] }
>;

@Injectable()
export class FetchDepartmentsByEmployerIdUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private departmentsRepository: DepartmentesRepository,
    private employersRepository: EmployersRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
  }: FetchDepartmentsByEmployerIdParams): Promise<FetchDepartmentsByEmployerIdResponse> {
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

    const departments = await this.departmentsRepository.fetchByEmployerId(
      employer.id.toString(),
    );

    return right({ departments });
  }
}
