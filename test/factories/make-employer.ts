import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Employer,
  EmployerProps,
} from '@/domain/registrations/enterprise/entities/employer';
import { faker } from '@faker-js/faker';
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
      cpf: faker.string.numeric({ length: 11 }),
      riskLevel: faker.number.int({ min: 1, max: 5 }),
      isActive: true,
      responsibleDoctor: new UniqueEntityID(randomUUID()),
      ...override,
    },
    id,
  );

  return employer;
}
