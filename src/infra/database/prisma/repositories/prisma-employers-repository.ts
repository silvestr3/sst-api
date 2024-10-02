import { EmployersRepository } from '@/domain/registrations/application/repositories/employers-repository';
import { Employer } from '@/domain/registrations/enterprise/entities/employer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaEmployerMapper } from '../mappers/prisma-employer-mapper';
import { EmployerWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/employer-with-details';

@Injectable()
export class PrismaEmployersRepository implements EmployersRepository {
  constructor(private prisma: PrismaService) {}
  async create(employer: Employer): Promise<void> {
    const data = PrismaEmployerMapper.toPrisma(employer);

    await this.prisma.employer.create({
      data,
    });
  }

  async save(employer: Employer): Promise<void> {
    const data = PrismaEmployerMapper.toPrisma(employer);

    await this.prisma.employer.update({
      data,
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<Employer | null> {
    const employer = await this.prisma.employer.findUnique({
      where: {
        id,
      },
    });

    if (!employer) return null;

    return PrismaEmployerMapper.toDomain(employer);
  }

  async fetchByGroupId(groupId: string): Promise<Employer[]> {
    const employers = await this.prisma.employer.findMany({
      where: {
        groupId,
      },
    });

    return employers.map((employer) => PrismaEmployerMapper.toDomain(employer));
  }

  findByIdWithDetails(id: string): Promise<EmployerWithDetails | null> {
    throw new Error('Method not implemented.');
  }
}
