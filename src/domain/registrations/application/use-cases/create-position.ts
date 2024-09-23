import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Position } from '../../enterprise/entities/position';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { PositionsRepository } from '../repositories/positions-repository';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Employer } from '../../enterprise/entities/employer';
import { EmployersRepository } from '../repositories/employers-repository';
import { Injectable } from '@nestjs/common';

interface CreatePositionParams {
  subscriptionId: string;
  executorId: string;
  employerId: string;
  name: string;
  description: string;
  cbo: string;
  isActive?: boolean;
}

type CreatePositionResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { position: Position }
>;

@Injectable()
export class CreatePositionUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private employersRepository: EmployersRepository,
    private positionsRepository: PositionsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
    name,
    description,
    cbo,
    isActive = true,
  }: CreatePositionParams): Promise<CreatePositionResponse> {
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

    const position = Position.create({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name,
      description,
      cbo,
      isActive,
    });

    await this.positionsRepository.create(position);

    return right({ position });
  }
}
