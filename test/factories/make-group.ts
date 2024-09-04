import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Group,
  GroupProps,
} from '@/domain/registrations/enterprise/entities/group';
import { PrismaGroupMapper } from '@/infra/database/prisma/mappers/prisma-group-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class GroupFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaGroup(data: Partial<GroupProps> = {}) {
    const group = makeGroup({
      ...data,
    });

    const dataGroup = PrismaGroupMapper.toPrisma(group);
    await this.prisma.group.create({
      data: dataGroup,
    });

    return { group };
  }
}
