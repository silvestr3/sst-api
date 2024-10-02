import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';
import { DepartmentWithDetails } from '../../enterprise/entities/value-objects/department-with-details';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { DepartmentesRepository } from '../repositories/departments-repository';

interface GetDepartmentDetailsParams {
  subscriptionId: string;
  executorId: string;
  departmentId: string;
}

type GetDepartmentDetailsResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { department: DepartmentWithDetails }
>;

@Injectable()
export class GetDepartmentDetailsUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private departmentsRepository: DepartmentesRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    departmentId,
  }: GetDepartmentDetailsParams): Promise<GetDepartmentDetailsResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const department =
      await this.departmentsRepository.findByIdWithDetails(departmentId);

    if (!department) {
      return left(new ResourceNotFoundError());
    }

    if (!department.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    return right({ department });
  }
}
