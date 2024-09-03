import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Address } from '@/domain/registrations/enterprise/entities/address';
import { Address as PrismaAddress } from '@prisma/client';

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress): Address {
    return Address.create(
      {
        subscriptionId: new UniqueEntityID(raw.subscriptionId),
        cep: raw.cep,
        city: raw.city,
        complement: raw.complement,
        district: raw.district,
        state: raw.state,
        street: raw.street,
        number: raw.number,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: Address): PrismaAddress {
    return {
      id: raw.id.toString(),
      subscriptionId: raw.subscriptionId.toString(),
      cep: raw.cep,
      city: raw.city,
      complement: raw.complement,
      district: raw.district,
      state: raw.state,
      street: raw.street,
      number: raw.number,
    };
  }
}
