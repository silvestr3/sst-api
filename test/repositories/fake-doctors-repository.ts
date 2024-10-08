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

  async save(doctor: Doctor): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(doctor.id));

    this.items[index] = doctor;
  }

  async findAll(subscriptionId: string): Promise<Doctor[]> {
    const doctors = this.items.filter(
      (item) => item.subscriptionId.toString() === subscriptionId,
    );

    return doctors;
  }

  async searchByName(
    subscriptionId: string,
    searchTerm: string,
  ): Promise<Doctor[]> {
    const doctors = this.items.filter(
      (item) =>
        item.subscriptionId.toString() === subscriptionId &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return doctors;
  }
}
