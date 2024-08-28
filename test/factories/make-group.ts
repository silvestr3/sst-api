import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Group,
  GroupProps,
} from '@/domain/registrations/enterprise/entities/group';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

export function makeGroup(
  override: Partial<GroupProps> = {},
  id?: UniqueEntityID,
) {
  const group = Group.create(
    {
      subscriptionId: new UniqueEntityID(randomUUID()),
      name: faker.company.name(),
      description: faker.lorem.sentence(5),
      isActive: true,
      ...override,
    },
    id,
  );

  return group;
}
