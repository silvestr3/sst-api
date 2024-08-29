import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Department,
  DepartmentProps,
} from '@/domain/registrations/enterprise/entities/department';
import { faker } from '@faker-js/faker';
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
