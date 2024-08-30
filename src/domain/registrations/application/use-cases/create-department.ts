import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EmployersRepository } from '../repositories/employers-repository';
import { MissingInformationError } from './errors/missing-information-error';
import { DepartmentesRepository } from '../repositories/departments-repository';
import { Department } from '../../enterprise/entities/department';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';

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

    const employer = await this.employersRepository.findById(employerId);

    if (!employer) {
      return left(new ResourceNotFoundError());
    }

    if (!employer.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

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
