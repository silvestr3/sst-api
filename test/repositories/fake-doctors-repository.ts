import { DoctorsRepository } from '@/domain/registrations/application/repositories/doctors-repository';
import { Doctor } from '@/domain/registrations/enterprise/entities/doctor';

export class FakeDoctorsRepository implements DoctorsRepository {
  public items: Doctor[] = [];

  async findById(id: string): Promise<Doctor | null> {
    const doctor = this.items.find((item) => item.id.toString() === id);

    return doctor ?? null;
  }

  async create(doctor: Doctor): Promise<void> {
    this.items.push(doctor);
  }
}
