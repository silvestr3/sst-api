import { DepartmentsRepository } from '@/domain/registrations/application/repositories/departments-repository';
import { Department } from '@/domain/registrations/enterprise/entities/department';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaDepartmentMapper } from '../mappers/prisma-department-mapper';
import { DepartmentWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/department-with-details';
import { PrismaDepartmentDetailsMapper } from '../mappers/prisma-department-details-mapper';

@Injectable()
export class PrismaDepartmentsRepository implements DepartmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(department: Department): Promise<void> {
    const data = PrismaDepartmentMapper.toPrisma(department);

    await this.prisma.department.create({ data });
  }

  async save(department: Department): Promise<void> {
    const data = PrismaDepartmentMapper.toPrisma(department);

    await this.prisma.department.update({
      data,
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<Department | null> {
    const department = await this.prisma.department.findUnique({
      where: {
        id,
      },
    });

    if (!department) return null;

    return PrismaDepartmentMapper.toDomain(department);
  }

  async fetchByEmployerId(id: string): Promise<Department[]> {
    const departments = await this.prisma.department.findMany({
      where: {
        employerId: id,
      },
    });

    return departments.map((department) =>
      PrismaDepartmentMapper.toDomain(department),
    );
  }

  async findByIdWithDetails(id: string): Promise<DepartmentWithDetails | null> {
    const department = await this.prisma.department.findUnique({
      where: {
        id,
      },
      include: {
        employer: true,
      },
    });

    if (!department) return null;

    return PrismaDepartmentDetailsMapper.toDomain(department);
  }

  async searchByName(
    subscriptionId: string,
    employerId: string,
    searchTerm: string,
  ): Promise<Department[]> {
    const deparments = await this.prisma.department.findMany({
      where: {
        subscriptionId,
        employerId,
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });

    return deparments.map(PrismaDepartmentMapper.toDomain);
  }
}
