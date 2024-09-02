import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Position } from '../../enterprise/entities/position';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { PositionsRepository } from '../repositories/positions-repository';
import { validateResourceOwnership } from './util/validate-resource-ownership';

interface EditPositionParams {
  subscriptionId: string;
  executorId: string;
  positionId: string;
  name?: string;
  description?: string;
  cbo?: string;
  isActive?: boolean;
}

type EditPositionResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { position: Position }
>;

export class EditPositionUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private positionsRepository: PositionsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    positionId,
    name,
    description,
    cbo,
    isActive = true,
  }: EditPositionParams): Promise<EditPositionResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const getPosition = await validateResourceOwnership<Position>({
      repository: this.positionsRepository,
      resourceId: positionId,
      subscriptionId: subscription.id,
    });

    if (getPosition.isLeft()) {
      return left(getPosition.value);
    }

    const position = getPosition.value;

    position.name = name ?? position.name;
    position.description = description ?? position.description;
    position.cbo = cbo ?? position.cbo;
    position.isActive = isActive ?? position.isActive;

    await this.positionsRepository.save(position);

    return right({ position });
  }
}
