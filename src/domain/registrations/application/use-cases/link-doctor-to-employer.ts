import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EmployersRepository } from '../repositories/employers-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { validateSubscription } from './util/validate-subscription';
import { DoctorsRepository } from '../repositories/doctors-repository';
import { validateResourceOwnership } from './util/validate-resource-ownership';
import { Employer } from '../../enterprise/entities/employer';
import { Doctor } from '../../enterprise/entities/doctor';
import { Injectable } from '@nestjs/common';

interface LinkDoctorToEmployerParams {
  subscriptionId: string;
  executorId: string;
  employerId: string;
  doctorId: string;
}

type LinkDoctorToEmployerResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

@Injectable()
export class LinkDoctorToEmployerUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private employersRepository: EmployersRepository,
    private doctorsRepository: DoctorsRepository,
  ) {}

  async execute({
    subscriptionId,
    executorId,
    employerId,
    doctorId,
  }: LinkDoctorToEmployerParams): Promise<LinkDoctorToEmployerResponse> {
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
      subscriptionId: subscription.id,
      resourceId: employerId,
    });

    if (getEmployer.isLeft()) {
      return left(getEmployer.value);
    }

    const getDoctor = await validateResourceOwnership<Doctor>({
      repository: this.doctorsRepository,
      subscriptionId: subscription.id,
      resourceId: doctorId,
    });

    if (getDoctor.isLeft()) {
      return left(getDoctor.value);
    }

    const employer = getEmployer.value;
    const doctor = getDoctor.value;

    employer.responsibleDoctorId = doctor.id;

    await this.employersRepository.save(employer);

    return right(null);
  }
}
