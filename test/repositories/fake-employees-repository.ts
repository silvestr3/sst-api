import { EmployeesRepository } from '@/domain/registrations/application/repositories/employees-repository';
import { Employee } from '@/domain/registrations/enterprise/entities/employee';
import { EmployeeWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/employee-with-details';
import { FakeEmployersRepository } from './fake-employers-repository';
import { FakeBranchesRepository } from './fake-branches-repository';
import { FakeDepartmentsRepository } from './fake-departments-repository';
import { FakePositionsRepository } from './fake-positions-repository';

export class FakeEmployeesRepository implements EmployeesRepository {
  constructor(
    private employersRepository: FakeEmployersRepository,
    private branchesRepository: FakeBranchesRepository,
    private departmentsRepository: FakeDepartmentsRepository,
    private positionsRepository: FakePositionsRepository,
  ) {}

  public items: Employee[] = [];

  async create(employee: Employee): Promise<void> {
    this.items.push(employee);
  }

  async save(employee: Employee): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(employee.id));

    this.items[index] = employee;
  }

  async findById(id: string): Promise<Employee | null> {
    const employee = this.items.find((item) => item.id.toString() === id);

    return employee ?? null;
  }

  async findByIdWithDetails(id: string): Promise<EmployeeWithDetails | null> {
    const employee = this.items.find((item) => item.id.toString() === id);

    if (!employee) return null;

    const employer = this.employersRepository.items.find((item) =>
      employee.employerId.equals(item.id),
    );

    const branch = this.branchesRepository.items.find((item) =>
      employee.branchId.equals(item.id),
    );

    const department = this.departmentsRepository.items.find((item) =>
      employee.departmentId.equals(item.id),
    );

    const position = this.positionsRepository.items.find((item) =>
      employee.positionId.equals(item.id),
    );

    return EmployeeWithDetails.create({
      subscriptionId: employee.subscriptionId,
      employeeId: employee.id,
      name: employee.name,
      cpf: employee.cpf,
      email: employee.email,
      admissionDate: employee.admissionDate,
      birthDate: employee.birthDate,
      gender: employee.gender,
      hasEmploymentRelationship: employee.hasEmploymentRelationship,
      registration: employee.registration,
      status: employee.status,
      lastClinicalEvaluation: employee.lastClinicalEvaluation,
      employer: {
        employerId: employer.id,
        nomeFantasia: employer.nomeFantasia,
        razaoSocial: employer.razaoSocial,
      },
      branch: {
        branchId: branch.id,
        name: branch.name,
      },
      department: {
        departmentId: department.id,
        name: department.name,
        description: department.description,
      },
      position: {
        positionId: position.id,
        name: position.name,
        description: position.description,
        cbo: position.cbo,
      },
    });
  }

  async fetchByEmployerId(employerId: string): Promise<Employee[]> {
    const employees = this.items.filter(
      (item) => item.employerId.toString() === employerId,
    );

    return employees;
  }

  async searchByName(
    subscriptionId: string,
    employerId: string,
    searchTerm: string,
  ): Promise<Employee[]> {
    const employees = this.items.filter(
      (item) =>
        item.subscriptionId.toString() === subscriptionId &&
        item.employerId.toString() === employerId &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return employees;
  }
}
