import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { validateSubscription } from './util/validate-subscription';
import { Doctor } from '../../enterprise/entities/doctor';
import { DoctorsRepository } from '../repositories/doctors-repository';
import { Injectable } from '@nestjs/common';

interface CreateDoctorParams {
  subscriptionId: string;
  executorId: string;
  name: string;
  crm: string;
  ufCrm: string;
  phone: string;
}

type CreateDoctorResponse = Either<NotAllowedError, { doctor: Doctor }>;

@Injectable()
export class CreateDoctorUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private doctorsRepository: DoctorsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    name,
    crm,
    ufCrm,
    phone,
  }: CreateDoctorParams): Promise<CreateDoctorResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const doctor = Doctor.create({
      subscriptionId: subscription.id,
      name,
      crm,
      ufCrm,
      phone,
    });

    await this.doctorsRepository.create(doctor);

    return right({ doctor });
  }
}
