import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Employer,
  EmployerProps,
} from '@/domain/registrations/enterprise/entities/employer';
import { Cpf } from '@/domain/registrations/enterprise/entities/value-objects/cpf';
import { PrismaEmployerMapper } from '@/infra/database/prisma/mappers/prisma-employer-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export function makeEmployer(
  override: Partial<EmployerProps> = {},
  id?: UniqueEntityID,
) {
  const employer = Employer.create(
    {
      subscriptionId: new UniqueEntityID(randomUUID()),
      groupId: new UniqueEntityID(randomUUID()),
      nomeFantasia: faker.company.name(),
      razaoSocial: faker.company.name(),
      cnae: faker.string.numeric({ length: 5 }),
      activity: faker.lorem.sentence(),
      eSocialEnrollmentType: 'CPF',
      cpf: Cpf.validateAndCreate('06185218011'),
      riskLevel: faker.number.int({ min: 1, max: 5 }),
      isActive: true,
      responsibleDoctorId: new UniqueEntityID(randomUUID()),
      ...override,
    },
    id,
  );

  return employer;
}

@Injectable()
export class EmployerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaEmployer(data: Partial<EmployerProps> = {}) {
    const employer = makeEmployer({
      ...data,
    });

    const dataEmployer = PrismaEmployerMapper.toPrisma(employer);
    await this.prisma.employer.create({
      data: dataEmployer,
    });

    return { employer };
  }
}
