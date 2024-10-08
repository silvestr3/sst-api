import { GroupsRepository } from '@/domain/registrations/application/repositories/groups-repository';
import { Group } from '@/domain/registrations/enterprise/entities/group';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaGroupMapper } from '../mappers/prisma-group-mapper';

@Injectable()
export class PrismaGroupsRepository implements GroupsRepository {
  constructor(private prisma: PrismaService) {}

  async create(group: Group): Promise<void> {
    const data = PrismaGroupMapper.toPrisma(group);

    await this.prisma.group.create({
      data,
    });
  }

  async save(group: Group): Promise<void> {
    const data = PrismaGroupMapper.toPrisma(group);

    await this.prisma.group.update({
      data,
      where: {
        id: data.id,
      },
    });
  }

  async delete(group: Group): Promise<void> {
    await this.prisma.group.delete({
      where: {
        id: group.id.toString(),
      },
    });
  }

  async findAll(subscriptionId: string): Promise<Group[]> {
    const groups = await this.prisma.group.findMany({
      where: {
        subscriptionId,
      },
    });

    return groups.map((group) => PrismaGroupMapper.toDomain(group));
  }

  async findById(id: string): Promise<Group | null> {
    const group = await this.prisma.group.findUnique({
      where: {
        id,
      },
    });

    if (!group) return null;

    return PrismaGroupMapper.toDomain(group);
  }

  async searchByName(
    subscriptionId: string,
    searchTerm: string,
  ): Promise<Group[]> {
    const groups = await this.prisma.group.findMany({
      where: {
        subscriptionId,
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });

    return groups.map((group) => PrismaGroupMapper.toDomain(group));
  }
}
