import { SubscriptionsRepository } from '@/domain/registrations/application/repositories/subscriptions-repository';
import { Subscription } from '@/domain/registrations/enterprise/entities/subscription';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaSubscriptionMapper } from '../mappers/prisma-subscription-mapper';

@Injectable()
export class PrismaSubscriptionsRepository implements SubscriptionsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        id,
      },
    });

    if (!subscription) return null;

    return PrismaSubscriptionMapper.toDomain(subscription);
  }

  async create(subscription: Subscription): Promise<void> {
    const data = PrismaSubscriptionMapper.toPrisma(subscription);

    await this.prisma.subscription.create({
      data,
    });
  }
}
