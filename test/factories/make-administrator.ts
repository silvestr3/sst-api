import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Administrator,
  AdministratorProps,
} from '@/domain/registrations/enterprise/entities/administrator';
import { Cpf } from '@/domain/registrations/enterprise/entities/value-objects/cpf';
import { PrismaAdministratorMapper } from '@/infra/database/prisma/mappers/prisma-administrator-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { makeSubscription } from './make-subscription';
import { PrismaSubscriptionMapper } from '@/infra/database/prisma/mappers/prisma-subscription-mapper';

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

@Injectable()
export class AdministratorFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdministrator(data: Partial<AdministratorProps> = {}) {
    const administrator = makeAdministrator({
      subscriptionId: null,
      ...data,
    });

    const subscription = makeSubscription({
      administratorId: administrator.id,
    });

    const dataAdministrator = PrismaAdministratorMapper.toPrisma(administrator);
    await this.prisma.user.create({
      data: dataAdministrator,
    });

    const dataSubscription = PrismaSubscriptionMapper.toPrisma(subscription);
    await this.prisma.subscription.create({
      data: dataSubscription,
    });

    dataAdministrator.subscriptionId = dataSubscription.id;
    await this.prisma.user.update({
      data: dataAdministrator,
      where: {
        id: dataAdministrator.id,
      },
    });

    return administrator;
  }
}
