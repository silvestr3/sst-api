import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { BranchFactory } from 'test/factories/make-branch';
import { DepartmentFactory } from 'test/factories/make-department';
import { EmployeeFactory } from 'test/factories/make-employee';
import { EmployerFactory } from 'test/factories/make-employer';
import { GroupFactory } from 'test/factories/make-group';
import { PositionFactory } from 'test/factories/make-position';

describe('Fetch employees from employer (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let groupFactory: GroupFactory;
  let employerFactory: EmployerFactory;
  let departmentFactory: DepartmentFactory;
  let positionFactory: PositionFactory;
  let employeeFactory: EmployeeFactory;
  let branchFactory: BranchFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        GroupFactory,
        EmployerFactory,
        EmployeeFactory,
        BranchFactory,
        PositionFactory,
        DepartmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    groupFactory = app.get(GroupFactory);
    employerFactory = app.get(EmployerFactory);
    employeeFactory = app.get(EmployeeFactory);
    branchFactory = app.get(BranchFactory);
    departmentFactory = app.get(DepartmentFactory);
    positionFactory = app.get(PositionFactory);

    await app.init();
  });

  test('[GET] /employers/:employerId/employees', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { group: group } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
      name: 'Test group 1',
    });

    const { employer } = await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
      nomeFantasia: 'Primeiro',
      responsibleDoctorId: null,
      addressId: null,
    });

    const { branch } = await branchFactory.makePrismaBranch({
      subscriptionId: subscription.id,
      employerId: employer.id,
    });

    const { department } = await departmentFactory.makePrismaDepartment({
      subscriptionId: subscription.id,
      employerId: employer.id,
    });

    const { position } = await positionFactory.makePrismaPosition({
      subscriptionId: subscription.id,
      employerId: employer.id,
    });

    await employeeFactory.makePrismaEmployee({
      subscriptionId: subscription.id,
      employerId: employer.id,
      groupId: group.id,
      branchId: branch.id,
      departmentId: department.id,
      positionId: position.id,
      name: 'Primeiro',
    });

    await employeeFactory.makePrismaEmployee({
      subscriptionId: subscription.id,
      employerId: employer.id,
      groupId: group.id,
      branchId: branch.id,
      departmentId: department.id,
      positionId: position.id,
      name: 'Segundo',
    });

    await employeeFactory.makePrismaEmployee({
      subscriptionId: subscription.id,
      employerId: employer.id,
      groupId: group.id,
      branchId: branch.id,
      departmentId: department.id,
      positionId: position.id,
      name: 'Terceiro',
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const employerId = employer.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/employers/${employerId}/employees`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    const { employees } = response.body;

    expect(response.statusCode).toEqual(200);
    expect(employees).toHaveLength(3);
    expect(response.body).toEqual(
      expect.objectContaining({
        employees: [
          expect.objectContaining({
            name: 'Primeiro',
          }),
          expect.objectContaining({
            name: 'Segundo',
          }),
          expect.objectContaining({
            name: 'Terceiro',
          }),
        ],
      }),
    );
  });
});
