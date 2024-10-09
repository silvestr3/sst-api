import { PositionsRepository } from '@/domain/registrations/application/repositories/positions-repository';
import { Position } from '@/domain/registrations/enterprise/entities/position';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaPositionMapper } from '../mappers/prisma-position-mapper';
import { PositionWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/position-with-details';
import { PrismaPositionDetailsMapper } from '../mappers/prisma-position-details-mapper';

@Injectable()
export class PrismaPositionsRepository implements PositionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(position: Position): Promise<void> {
    const data = PrismaPositionMapper.toPrisma(position);

    await this.prisma.position.create({ data });
  }

  async save(position: Position): Promise<void> {
    const data = PrismaPositionMapper.toPrisma(position);

    await this.prisma.position.update({
      data,
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<Position | null> {
    const position = await this.prisma.position.findUnique({
      where: {
        id,
      },
    });

    if (!position) return null;

    return PrismaPositionMapper.toDomain(position);
  }

  async findByIdWithDetails(id: string): Promise<PositionWithDetails | null> {
    const position = await this.prisma.position.findUnique({
      where: {
        id,
      },
      include: {
        employer: true,
      },
    });

    if (!position) return null;

    return PrismaPositionDetailsMapper.toDomain(position);
  }

  async fetchByEmployerId(id: string): Promise<Position[]> {
    const positions = await this.prisma.position.findMany({
      where: {
        employerId: id,
      },
    });

    return positions.map(PrismaPositionMapper.toDomain);
  }

  async searchByName(
    subscriptionId: string,
    employerId: string,
    searchTerm: string,
  ): Promise<Position[]> {
    const positions = await this.prisma.position.findMany({
      where: {
        subscriptionId,
        employerId,
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });

    return positions.map(PrismaPositionMapper.toDomain);
  }
}
