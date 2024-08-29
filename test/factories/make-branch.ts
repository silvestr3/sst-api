import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Branch,
  BranchProps,
} from '@/domain/registrations/enterprise/entities/branch';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

export function makeBranch(
  override: Partial<BranchProps> = {},
  id?: UniqueEntityID,
) {
  const branch = Branch.create(
    {
      subscriptionId: new UniqueEntityID(randomUUID()),
      employerId: new UniqueEntityID(randomUUID()),
      name: faker.company.name(),
      ...override,
    },
    id,
  );

  return branch;
}
