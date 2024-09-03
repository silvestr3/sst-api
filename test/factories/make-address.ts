import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Address,
  AddressProps,
} from '@/domain/registrations/enterprise/entities/address';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

export function makeAddress(
  override: Partial<AddressProps> = {},
  id?: UniqueEntityID,
) {
  const address = Address.create(
    {
      subscriptionId: new UniqueEntityID(randomUUID()),
      cep: faker.location.zipCode(),
      city: faker.location.city(),
      complement: faker.lorem.sentence(3),
      number: faker.string.numeric(),
      street: faker.location.street(),
      district: faker.location.county(),
      state: faker.location.state(),
      ...override,
    },
    id,
  );

  return address;
}
