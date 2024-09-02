import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DepartmentesRepository } from '../repositories/departments-repository';
import { Department } from '../../enterprise/entities/department';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';
import { validateResourceOwnership } from './util/validate-resource-ownership';

interface EditDepartmentParams {
  subscriptionId: string;
  executorId: string;
  departmentId: string;
  name?: string;
  description?: string;
}

type EditDepartmentResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { department: Department }
>;

export class EditDepartmentUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private departmentsRepository: DepartmentesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    departmentId,
    name,
    description,
  }: EditDepartmentParams): Promise<EditDepartmentResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const getDepartment = await validateResourceOwnership<Department>({
      repository: this.departmentsRepository,
      resourceId: departmentId,
      subscriptionId: subscription.id,
    });

    if (getDepartment.isLeft()) {
      return left(getDepartment.value);
    }

    const department = getDepartment.value;

    department.name = name ?? department.name;
    department.description = description ?? department.description;

    await this.departmentsRepository.save(department);

    return right({ department });
  }
}
