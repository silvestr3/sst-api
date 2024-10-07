import { EmployeesRepository } from '@/domain/registrations/application/repositories/employees-repository';
import { Employee } from '@/domain/registrations/enterprise/entities/employee';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaEmployeeMapper } from '../mappers/prisma-employee-mapper';
import { EmployeeWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/employee-with-details';
import { PrismaEmployeeDetailsMapper } from '../mappers/prisma-employee-details-mapper';

@Injectable()
export class PrismaEmployeesRepository implements EmployeesRepository {
  constructor(private prisma: PrismaService) {}

  async create(employee: Employee): Promise<void> {
    const data = PrismaEmployeeMapper.toPrisma(employee);

    await this.prisma.employee.create({
      data,
    });
  }

  async save(employee: Employee): Promise<void> {
    const data = PrismaEmployeeMapper.toPrisma(employee);

    await this.prisma.employee.update({
      data,
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) return null;

    return PrismaEmployeeMapper.toDomain(employee);
  }

  async findByIdWithDetails(id: string): Promise<EmployeeWithDetails | null> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id,
      },
      include: {
        employer: true,
        branch: true,
        department: true,
        position: true,
      },
    });

    if (!employee) return null;

    return PrismaEmployeeDetailsMapper.toDomain(employee);
  }

  async fetchByEmployerId(employerId: string): Promise<Employee[]> {
    const employees = await this.prisma.employee.findMany({
      where: {
        employerId,
      },
    });

    return employees.map(PrismaEmployeeMapper.toDomain);
  }
}
