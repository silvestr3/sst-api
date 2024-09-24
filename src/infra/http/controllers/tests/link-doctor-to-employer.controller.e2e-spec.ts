import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DoctorFactory } from 'test/factories/make-doctor';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { EmployerFactory } from 'test/factories/make-employer';
import { GroupFactory } from 'test/factories/make-group';

describe('Link doctor to employer (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let groupFactory: GroupFactory;
  let employerFactory: EmployerFactory;
  let doctorFactory: DoctorFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        GroupFactory,
        EmployerFactory,
        DoctorFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    groupFactory = app.get(GroupFactory);
    employerFactory = app.get(EmployerFactory);
    doctorFactory = app.get(DoctorFactory);

    await app.init();
  });

  test('[PATCH] /employers/:employerId/doctor', async () => {
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

    const { doctor } = await doctorFactory.makePrismaDoctor({
      subscriptionId: subscription.id,
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const employerId = employer.id.toString();
    const doctorId = doctor.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/employers/${employerId}/doctor`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        doctorId,
      });

    expect(response.statusCode).toEqual(204);

    const employerOnDb = await prisma.employer.findUnique({
      where: {
        id: employerId,
      },
    });

    expect(employerOnDb.responsibleDoctorId).toEqual(doctorId);
  });
});
