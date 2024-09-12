import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Address,
  AddressProps,
} from '@/domain/registrations/enterprise/entities/address';
import { PrismaAddressMapper } from '@/infra/database/prisma/mappers/prisma-address-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAddress(data: Partial<AddressProps> = {}) {
    const address = makeAddress({
      ...data,
    });

    const dataAddress = PrismaAddressMapper.toPrisma(address);
    await this.prisma.address.create({
      data: dataAddress,
    });

    return { address };
  }
}
