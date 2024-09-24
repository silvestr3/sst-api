import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';
import { DoctorsRepository } from '../repositories/doctors-repository';
import { Doctor } from '../../enterprise/entities/doctor';

interface FetchAllDoctorsParams {
  subscriptionId: string;
  executorId: string;
}

type FetchAllDoctorsResponse = Either<NotAllowedError, { doctors: Doctor[] }>;

@Injectable()
export class FetchAllDoctorsUseCase {
  constructor(
    private doctorsRepository: DoctorsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
  }: FetchAllDoctorsParams): Promise<FetchAllDoctorsResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const doctors = await this.doctorsRepository.findAll(
      subscription.id.toString(),
    );

    return right({ doctors });
  }
}
