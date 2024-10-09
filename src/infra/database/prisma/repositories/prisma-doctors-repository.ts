import { DoctorsRepository } from '@/domain/registrations/application/repositories/doctors-repository';
import { Doctor } from '@/domain/registrations/enterprise/entities/doctor';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaDoctorMapper } from '../mappers/prisma-doctor-mapper';

@Injectable()
export class PrismaDoctorsRepository implements DoctorsRepository {
  constructor(private prisma: PrismaService) {}
  async findById(id: string): Promise<Doctor | null> {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        id,
      },
    });

    if (!doctor) return null;

    return PrismaDoctorMapper.toDomain(doctor);
  }

  async create(doctor: Doctor): Promise<void> {
    const data = PrismaDoctorMapper.toPrisma(doctor);

    await this.prisma.doctor.create({
      data,
    });
  }

  async save(doctor: Doctor): Promise<void> {
    const data = PrismaDoctorMapper.toPrisma(doctor);

    await this.prisma.doctor.update({
      data,
      where: {
        id: data.id,
      },
    });
  }

  async findAll(subscriptionId: string): Promise<Doctor[]> {
    const doctors = await this.prisma.doctor.findMany({
      where: {
        subscriptionId,
      },
    });

    return doctors.map(PrismaDoctorMapper.toDomain);
  }

  async searchByName(
    subscriptionId: string,
    searchTerm: string,
  ): Promise<Doctor[]> {
    const doctors = await this.prisma.doctor.findMany({
      where: {
        subscriptionId,
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });

    return doctors.map((doctor) => PrismaDoctorMapper.toDomain(doctor));
  }
}
