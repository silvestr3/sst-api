import { AddressesRepository } from '@/domain/registrations/application/repositories/addresses-repository';
import { Address } from '@/domain/registrations/enterprise/entities/address';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAddressMapper } from '../mappers/prisma-address-mapper';

@Injectable()
export class PrismaAddressesRepository implements AddressesRepository {
  constructor(private prisma: PrismaService) {}

  async create(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address);

    await this.prisma.address.create({
      data,
    });
  }

  async save(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address);

    await this.prisma.address.update({
      data,
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: {
        id,
      },
    });

    if (!address) return null;

    return PrismaAddressMapper.toDomain(address);
  }
}
