import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Position,
  PositionProps,
} from '@/domain/registrations/enterprise/entities/position';
import { PrismaPositionMapper } from '@/infra/database/prisma/mappers/prisma-position-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class PositionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPosition(data: Partial<PositionProps> = {}) {
    const position = makePosition({
      ...data,
    });

    const dataPosition = PrismaPositionMapper.toPrisma(position);
    await this.prisma.position.create({
      data: dataPosition,
    });

    return { position };
  }
}
