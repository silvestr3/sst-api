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

describe('Edit employee (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let groupFactory: GroupFactory;
  let administratorFactory: AdministratorFactory;
  let employerFactory: EmployerFactory;
  let branchFactory: BranchFactory;
  let departmentFactory: DepartmentFactory;
  let positionFactory: PositionFactory;
  let employeeFactory: EmployeeFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        GroupFactory,
        EmployerFactory,
        BranchFactory,
        DepartmentFactory,
        PositionFactory,
        EmployeeFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    groupFactory = app.get(GroupFactory);
    employerFactory = app.get(EmployerFactory);
    branchFactory = app.get(BranchFactory);
    departmentFactory = app.get(DepartmentFactory);
    positionFactory = app.get(PositionFactory);
    employeeFactory = app.get(EmployeeFactory);

    await app.init();
  });

  test('[PATCH] /employees/:employeeId', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { group } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
      name: 'Test group 1',
    });

    const { employer } = await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
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

    const { employee } = await employeeFactory.makePrismaEmployee({
      subscriptionId: subscription.id,
      groupId: group.id,
      employerId: employer.id,
      branchId: branch.id,
      departmentId: department.id,
      positionId: position.id,
      status: 'ACTIVE',
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const employeeId = employee.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/employees/${employeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        status: 'VACATIONS',
      });

    expect(response.statusCode).toEqual(204);

    const employeeOnDb = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
    });

    expect(employeeOnDb).toBeTruthy();
    expect(employeeOnDb).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        status: 'VACATIONS',
        email: employee.email,
      }),
    );
  });
});
