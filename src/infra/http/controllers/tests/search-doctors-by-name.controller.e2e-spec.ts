import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { DoctorFactory } from 'test/factories/make-doctor';

describe('Search doctor by name (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let doctorFactory: DoctorFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [AdministratorFactory, PrismaService, DoctorFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    doctorFactory = app.get(DoctorFactory);

    await app.init();
  });

  test('[GET] /doctors/search', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { subscription: subscription2 } =
      await administratorFactory.makePrismaAdministrator();

    await doctorFactory.makePrismaDoctor({
      subscriptionId: subscription.id,
      name: 'Return 1',
    });

    await doctorFactory.makePrismaDoctor({
      subscriptionId: subscription.id,
      name: 'Return 2',
    });

    await doctorFactory.makePrismaDoctor({
      subscriptionId: subscription.id,
      name: 'Return 3',
    });

    await doctorFactory.makePrismaDoctor({
      subscriptionId: subscription2.id,
      name: 'Return 4',
    });

    await doctorFactory.makePrismaDoctor({
      subscriptionId: subscription.id,
      name: 'Other',
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .get(`/doctors/search?q=return`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        doctors: [
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
