import { Repository } from '@/core/repositories/repository';
import { Doctor } from '../../enterprise/entities/doctor';

export abstract class DoctorsRepository extends Repository<Doctor> {
  abstract findById(id: string): Promise<Doctor | null>;
  abstract findAll(subscriptionId: string): Promise<Doctor[]>;
  abstract create(doctor: Doctor): Promise<void>;
  abstract save(doctor: Doctor): Promise<void>;
}
