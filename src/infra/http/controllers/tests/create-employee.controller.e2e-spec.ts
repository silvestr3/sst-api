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
import { EmployerFactory } from 'test/factories/make-employer';
import { GroupFactory } from 'test/factories/make-group';
import { PositionFactory } from 'test/factories/make-position';

describe('Create employee (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let groupFactory: GroupFactory;
  let administratorFactory: AdministratorFactory;
  let employerFactory: EmployerFactory;
  let branchFactory: BranchFactory;
  let departmentFactory: DepartmentFactory;
  let positionFactory: PositionFactory;

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

    await app.init();
  });

  test('[POST] /employers/:employerId/employees', async () => {
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

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const employerId = employer.id.toString();

    const response = await request(app.getHttpServer())
      .post(`/employers/${employerId}/employees`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        groupId: group.id.toString(),
        branchId: branch.id.toString(),
        departmentId: department.id.toString(),
        positionId: position.id.toString(),
        name: 'John Doe',
        cpf: '42163902005',
        gender: 'MALE',
        admissionDate: new Date('2024-12-17T08:00:00').toISOString(),
        birthDate: new Date('1997-05-04T08:00:00').toISOString(),
        hasEmploymentRelationship: false,
        email: 'johndoe@email.com',
      });

    expect(response.statusCode).toEqual(201);

    expect(response.body).toEqual({
      employee: expect.objectContaining({
        id: expect.any(String),
        employerId: employer.id.toString(),
      }),
    });

    const employeeOnDb = await prisma.employee.findFirst({
      where: {
        name: 'John Doe',
      },
    });

    expect(employeeOnDb).toBeTruthy();
    expect(employeeOnDb).toEqual(
      expect.objectContaining({
        employerId: employer.id.toString(),
        name: 'John Doe',
        status: 'ACTIVE',
      }),
    );
  });
});
