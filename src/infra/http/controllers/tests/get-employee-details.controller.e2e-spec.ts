import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { EmployeeFactory } from 'test/factories/make-employee';
import { GroupFactory } from 'test/factories/make-group';
import { EmployerFactory } from 'test/factories/make-employer';
import { DepartmentFactory } from 'test/factories/make-department';
import { BranchFactory } from 'test/factories/make-branch';
import { PositionFactory } from 'test/factories/make-position';

describe('Get employee details (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let groupFactory: GroupFactory;
  let employeeFactory: EmployeeFactory;
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
        GroupFactory,
        EmployeeFactory,
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
    groupFactory = app.get(GroupFactory);
    employeeFactory = app.get(EmployeeFactory);
    employerFactory = app.get(EmployerFactory);
    departmentFactory = app.get(DepartmentFactory);
    branchFactory = app.get(BranchFactory);
    positionFactory = app.get(PositionFactory);

    await app.init();
  });

  test('[GET] /employees/:employeeId', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { group: group } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
      name: 'Test group 1',
    });

    const { employer } = await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
      responsibleDoctorId: null,
      addressId: null,
    });

    const { department } = await departmentFactory.makePrismaDepartment({
      subscriptionId: subscription.id,
      employerId: employer.id,
    });

    const { branch } = await branchFactory.makePrismaBranch({
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
      departmentId: department.id,
      branchId: branch.id,
      positionId: position.id,
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const employeeId = employee.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/employees/${employeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        employee: expect.objectContaining({
          id: employee.id.toString(),
          employer: expect.objectContaining({
            employerId: employer.id.toString(),
            nomeFantasia: employer.nomeFantasia,
          }),
          position: expect.objectContaining({
            positionId: position.id.toString(),
            name: position.name,
          }),
          branch: expect.objectContaining({
            branchId: branch.id.toString(),
            name: branch.name,
          }),
          department: expect.objectContaining({
            departmentId: department.id.toString(),
            name: department.name,
          }),
        }),
      }),
    );
  });
});
