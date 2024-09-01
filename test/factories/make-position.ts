import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Position,
  PositionProps,
} from '@/domain/registrations/enterprise/entities/position';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

export function makePosition(
  override: Partial<PositionProps> = {},
  id?: UniqueEntityID,
) {
  const position = Position.create(
    {
      subscriptionId: new UniqueEntityID(randomUUID()),
      employerId: new UniqueEntityID(randomUUID()),
      name: faker.person.jobTitle(),
      description: faker.person.jobDescriptor(),
      cbo: faker.string.numeric({ length: 5 }),
      isActive: true,
      ...override,
    },
    id,
  );

  return position;
}
