import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';
import { Doctor } from '../../enterprise/entities/doctor';
import { DoctorsRepository } from '../repositories/doctors-repository';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Injectable } from '@nestjs/common';

interface EditDoctorParams {
  subscriptionId: string;
  executorId: string;
  doctorId: string;
  name?: string;
  crm?: string;
  ufCrm?: string;
  phone?: string;
}

type EditDoctorResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { doctor: Doctor }
>;

@Injectable()
export class EditDoctorUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private doctorsRepository: DoctorsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    doctorId,
    name,
    crm,
    ufCrm,
    phone,
  }: EditDoctorParams): Promise<EditDoctorResponse> {
    const subscription = await validateSubscription({
      executorId,
      subscriptionId,
      subscriptionsRepository: this.subscriptionsRepository,
    });

    if (!subscription) {
      return left(new NotAllowedError());
    }

    const getDoctor = await validateResourceOwnership<Doctor>({
      repository: this.doctorsRepository,
      resourceId: doctorId,
      subscriptionId: subscription.id,
    });

    if (getDoctor.isLeft()) {
      return left(getDoctor.value);
    }

    const doctor = getDoctor.value;

    doctor.name = name ?? doctor.name;
    doctor.crm = crm ?? doctor.crm;
    doctor.ufCrm = ufCrm ?? doctor.ufCrm;
    doctor.phone = phone ?? doctor.phone;

    await this.doctorsRepository.save(doctor);

    return right({ doctor });
  }
}
