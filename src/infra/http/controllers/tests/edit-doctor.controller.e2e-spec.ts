import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { DoctorFactory } from 'test/factories/make-doctor';
import { GroupFactory } from 'test/factories/make-group';

describe('Edit doctor (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let groupFactory: GroupFactory;
  let administratorFactory: AdministratorFactory;
  let doctorFactory: DoctorFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        GroupFactory,
        DoctorFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    groupFactory = app.get(GroupFactory);
    doctorFactory = app.get(DoctorFactory);

    await app.init();
  });

  test('[PATCH] /doctors/:doctorId', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const { doctor } = await doctorFactory.makePrismaDoctor({
      subscriptionId: subscription.id,
    });

    const doctorId = doctor.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/doctors/${doctorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Doutor Pimpolho',
      });

    expect(response.statusCode).toEqual(204);

    const doctorOnDb = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });

    expect(doctorOnDb).toBeTruthy();
    expect(doctorOnDb).toEqual(
      expect.objectContaining({
        name: 'Doutor Pimpolho',
        crm: doctor.crm,
        ufCrm: doctor.ufCrm,
        phone: doctor.phone,
      }),
    );
  });
});
