import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';
import { PositionWithDetails } from '../../enterprise/entities/value-objects/position-with-details';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { PositionsRepository } from '../repositories/positions-repository';

interface GetPositionDetailsParams {
  subscriptionId: string;
  executorId: string;
  positionId: string;
}

type GetPositionDetailsResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { position: PositionWithDetails }
>;

@Injectable()
export class GetPositionDetailsUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private positionsRepository: PositionsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    positionId,
  }: GetPositionDetailsParams): Promise<GetPositionDetailsResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const position =
      await this.positionsRepository.findByIdWithDetails(positionId);

    if (!position) {
      return left(new ResourceNotFoundError());
    }

    if (!position.subscriptionId.equals(subscription.id)) {
      return left(new NotAllowedError());
    }

    return right({ position });
  }
}
