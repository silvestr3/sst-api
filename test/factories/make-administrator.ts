import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Administrator,
  AdministratorProps,
} from '@/domain/registrations/enterprise/entities/administrator';
import { Cpf } from '@/domain/registrations/enterprise/entities/value-objects/cpf';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

export function makeAdministrator(
  override: Partial<AdministratorProps> = {},
  id?: UniqueEntityID,
) {
  const administrator = Administrator.create(
    {
      subscriptionId: new UniqueEntityID(randomUUID()),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      cpf: Cpf.validateAndCreate('23016215020'),
      ...override,
    },
    id,
  );

  return administrator;
}
