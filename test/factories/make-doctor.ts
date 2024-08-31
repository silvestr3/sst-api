import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Doctor,
  DoctorProps,
} from '@/domain/registrations/enterprise/entities/doctor';
import { faker } from '@faker-js/faker';
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
