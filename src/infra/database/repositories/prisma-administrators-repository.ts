import { AdministratorsRepository } from '@/domain/registrations/application/repositories/administrators-repository';
import { Administrator } from '@/domain/registrations/enterprise/entities/administrator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAdministratorMapper } from '../mappers/prisma-administrator-mapper';

@Injectable()
export class PrismaAdministratorsRepository
  implements AdministratorsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Administrator | null> {
    const administrator = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return PrismaAdministratorMapper.toDomain(administrator);
  }

  async findByEmail(email: string): Promise<Administrator | null> {
    const administrator = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return PrismaAdministratorMapper.toDomain(administrator);
  }

  async create(administrator: Administrator): Promise<void> {
    const data = PrismaAdministratorMapper.toPrisma(administrator);

    await this.prisma.user.create({
      data,
    });
  }

  async save(administrator: Administrator): Promise<void> {
    const data = PrismaAdministratorMapper.toPrisma(administrator);

    await this.prisma.user.update({
      data,
      where: {
        id: data.id,
      },
    });
  }
}
