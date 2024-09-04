import { Either, left, right } from '@/core/either';
import { Group } from '../../enterprise/entities/group';
import { GroupsRepository } from '../repositories/groups-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';

interface CreateGroupParams {
  subscriptionId: string;
  executorId: string;
  name: string;
  description: string;
  isActive?: boolean;
}

type CreateGroupResponse = Either<NotAllowedError, { group: Group }>;

@Injectable()
export class CreateGroupUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    name,
    description,
    isActive = true,
  }: CreateGroupParams): Promise<CreateGroupResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const group = Group.create({
      subscriptionId: subscription.id,
      name,
      description,
      isActive,
    });

    await this.groupsRepository.create(group);

    return right({ group });
  }
}
