import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Employee,
  EmployeeProps,
} from '@/domain/registrations/enterprise/entities/employee';
import { Cpf } from '@/domain/registrations/enterprise/entities/value-objects/cpf';
import { PrismaEmployeeMapper } from '@/infra/database/prisma/mappers/prisma-employee-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export function makeEmployee(
  override: Partial<EmployeeProps> = {},
  id?: UniqueEntityID,
) {
  const employee = Employee.create(
    {
      subscriptionId: new UniqueEntityID(randomUUID()),
      groupId: new UniqueEntityID(randomUUID()),
      employerId: new UniqueEntityID(randomUUID()),
      branchId: new UniqueEntityID(randomUUID()),
      departmentId: new UniqueEntityID(randomUUID()),
      positionId: new UniqueEntityID(randomUUID()),
      name: faker.person.fullName(),
      cpf: Cpf.validateAndCreate('70031356044'),
      admissionDate: new Date(),
      birthDate: new Date(),
      hasEmploymentRelationship: false,
      gender: 'FEMALE',
      email: faker.internet.email(),
      status: 'ACTIVE',
      ...override,
    },
    id,
  );

  return employee;
}

@Injectable()
export class EmployeeFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaEmployee(data: Partial<EmployeeProps> = {}) {
    const employee = makeEmployee({
      ...data,
    });

    const dataEmployee = PrismaEmployeeMapper.toPrisma(employee);
    await this.prisma.employee.create({
      data: dataEmployee,
    });

    return { employee };
  }
}
