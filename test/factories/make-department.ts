import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Department,
  DepartmentProps,
} from '@/domain/registrations/enterprise/entities/department';
import { PrismaDepartmentMapper } from '@/infra/database/prisma/mappers/prisma-department-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export function makeDepartment(
  override: Partial<DepartmentProps> = {},
  id?: UniqueEntityID,
) {
  const department = Department.create(
    {
      subscriptionId: new UniqueEntityID(randomUUID()),
      employerId: new UniqueEntityID(randomUUID()),
      name: faker.company.name(),
      description: faker.lorem.sentence(5),
      ...override,
    },
    id,
  );

  return department;
}

@Injectable()
export class DepartmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDepartment(data: Partial<DepartmentProps> = {}) {
    const department = makeDepartment({
      ...data,
    });

    const dataDepartment = PrismaDepartmentMapper.toPrisma(department);
    await this.prisma.department.create({
      data: dataDepartment,
    });

    return { department };
  }
}
