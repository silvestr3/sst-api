import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Doctor,
  DoctorProps,
} from '@/domain/registrations/enterprise/entities/doctor';
import { PrismaDoctorMapper } from '@/infra/database/prisma/mappers/prisma-doctor-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export function makeDoctor(
  override: Partial<DoctorProps> = {},
  id?: UniqueEntityID,
) {
  const doctor = Doctor.create(
    {
      subscriptionId: new UniqueEntityID(randomUUID()),
      name: faker.company.name(),
      crm: faker.string.alphanumeric({ length: 5 }),
      ufCrm: 'GO',
      phone: faker.phone.number(),
      ...override,
    },
    id,
  );

  return doctor;
}

@Injectable()
export class DoctorFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDoctor(data: Partial<DoctorProps> = {}) {
    const doctor = makeDoctor({
      ...data,
    });

    const dataDoctor = PrismaDoctorMapper.toPrisma(doctor);
    await this.prisma.doctor.create({
      data: dataDoctor,
    });

    return { doctor };
  }
}
