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

describe('Search employee by name (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let employeeFactory: EmployeeFactory;
  let groupFactory: GroupFactory;
  let employerFactory: EmployerFactory;

  let departmentFactory: DepartmentFactory;
  let branchFactory: BranchFactory;
  let positionFactory: PositionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        EmployeeFactory,
        GroupFactory,
        EmployerFactory,
        DepartmentFactory,
        BranchFactory,
        PositionFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    employeeFactory = app.get(EmployeeFactory);
    groupFactory = app.get(GroupFactory);
    employerFactory = app.get(EmployerFactory);
    departmentFactory = app.get(DepartmentFactory);
    branchFactory = app.get(BranchFactory);
    positionFactory = app.get(PositionFactory);

    await app.init();
  });

  test('[GET] /employees/search', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { subscription: subscription2 } =
      await administratorFactory.makePrismaAdministrator();

    const { group } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
    });

    const { employer } = await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
      addressId: null,
      responsibleDoctorId: null,
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
      branchId: branch.id,
      departmentId: department.id,
      positionId: position.id,
      groupId: group.id,
      name: 'Return 1',
    });

    await employeeFactory.makePrismaEmployee({
      subscriptionId: subscription.id,
      employerId: employer.id,
      branchId: branch.id,
      departmentId: department.id,
      positionId: position.id,
      groupId: group.id,
      name: 'Return 2',
    });

    await employeeFactory.makePrismaEmployee({
      subscriptionId: subscription.id,
      employerId: employer.id,
      branchId: branch.id,
      departmentId: department.id,
      positionId: position.id,
      groupId: group.id,
      name: 'Return 3',
    });

    await employeeFactory.makePrismaEmployee({
      subscriptionId: subscription.id,
      employerId: employer.id,
      branchId: branch.id,
      departmentId: department.id,
      positionId: position.id,
      groupId: group.id,
      name: 'Other',
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .get(`/employees/search/?q=retur&employerId=${employer.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        employees: [
          expect.objectContaining({
            name: 'Return 1',
          }),
          expect.objectContaining({
            name: 'Return 2',
          }),
          expect.objectContaining({
            name: 'Return 3',
          }),
        ],
      }),
    );
  });
});
