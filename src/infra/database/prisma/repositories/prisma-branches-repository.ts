import { BranchesRepository } from '@/domain/registrations/application/repositories/branches-repository';
import { Branch } from '@/domain/registrations/enterprise/entities/branch';
import { PrismaService } from '../prisma.service';
import { PrismaBranchMapper } from '../mappers/prisma-branch-mapper';
import { Injectable } from '@nestjs/common';
import { BranchWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/branch-with-details';
import { PrismaBranchDetailsMapper } from '../mappers/prisma-branch-details-mapper';

@Injectable()
export class PrismaBranchesRepository implements BranchesRepository {
  constructor(private prisma: PrismaService) {}

  async create(branch: Branch): Promise<void> {
    const data = PrismaBranchMapper.toPrisma(branch);

    await this.prisma.branch.create({
      data,
    });
  }

  async save(branch: Branch): Promise<void> {
    const data = PrismaBranchMapper.toPrisma(branch);

    await this.prisma.branch.update({
      data,
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<Branch | null> {
    const branch = await this.prisma.branch.findUnique({
      where: {
        id,
      },
    });

    if (!branch) return null;

    return PrismaBranchMapper.toDomain(branch);
  }

  async findByIdWithDetails(id: string): Promise<BranchWithDetails | null> {
    const branch = await this.prisma.branch.findUnique({
      where: {
        id,
      },
      include: {
        employer: true,
        address: true,
      },
    });

    return PrismaBranchDetailsMapper.toDomain(branch);
  }

  async fetchByEmployerId(id: string): Promise<Branch[]> {
    const branches = await this.prisma.branch.findMany({
      where: {
        employerId: id,
      },
    });

    return branches.map((branch) => PrismaBranchMapper.toDomain(branch));
  }
}
