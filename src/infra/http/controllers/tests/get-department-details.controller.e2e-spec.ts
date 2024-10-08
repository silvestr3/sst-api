import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { DepartmentFactory } from 'test/factories/make-department';
import { GroupFactory } from 'test/factories/make-group';
import { AddressFactory } from 'test/factories/make-address';
import { DoctorFactory } from 'test/factories/make-doctor';
import { EmployerFactory } from 'test/factories/make-employer';

describe('Get department details (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let groupFactory: GroupFactory;
  let departmentFactory: DepartmentFactory;
  let addressFactory: AddressFactory;
  let doctorFactory: DoctorFactory;
  let employerFactory: EmployerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        GroupFactory,
        DepartmentFactory,
        AddressFactory,
        DoctorFactory,
        EmployerFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    groupFactory = app.get(GroupFactory);
    departmentFactory = app.get(DepartmentFactory);
    addressFactory = app.get(AddressFactory);
    doctorFactory = app.get(DoctorFactory);
    employerFactory = app.get(EmployerFactory);

    await app.init();
  });

  test('[GET] /departments/:departmentId/details', async () => {
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

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const departmentId = department.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/departments/${departmentId}/details`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        department: expect.objectContaining({
          id: department.id.toString(),
          employer: expect.objectContaining({
            employerId: employer.id.toString(),
            nomeFantasia: employer.nomeFantasia,
          }),
        }),
      }),
    );
  });
});
