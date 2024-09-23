import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EmployersRepository } from '../repositories/employers-repository';
import { DepartmentesRepository } from '../repositories/departments-repository';
import { Department } from '../../enterprise/entities/department';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Employer } from '../../enterprise/entities/employer';
import { Injectable } from '@nestjs/common';

interface CreateDepartmentParams {
  subscriptionId: string;
  executorId: string;
  employerId: string;
  name: string;
  description: string;
}

type CreateDepartmentResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { department: Department }
>;
@Injectable()
export class CreateDepartmentUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private employersRepository: EmployersRepository,
    private departmentsRepository: DepartmentesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
    name,
    description,
  }: CreateDepartmentParams): Promise<CreateDepartmentResponse> {
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

    const department = Department.create({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name,
      description,
    });

    await this.departmentsRepository.create(department);

    return right({ department });
  }
}
