import { Either, left, right } from '@/core/either';
import { Doctor } from '../../enterprise/entities/doctor';
import { DoctorsRepository } from '../repositories/doctors-repository';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Injectable } from '@nestjs/common';

interface SearchDoctorsByNameParams {
  subscriptionId: string;
  executorId: string;
  searchTerm: string;
}

type SearchDoctorsByNameResponse = Either<
  NotAllowedError,
  { doctors: Doctor[] }
>;

@Injectable()
export class SearchDoctorsByNameUseCase {
  constructor(
    private doctorsRepository: DoctorsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    searchTerm,
  }: SearchDoctorsByNameParams): Promise<SearchDoctorsByNameResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const doctors = await this.doctorsRepository.searchByName(
      subscription.id.toString(),
      searchTerm,
    );

    return right({ doctors });
  }
}
