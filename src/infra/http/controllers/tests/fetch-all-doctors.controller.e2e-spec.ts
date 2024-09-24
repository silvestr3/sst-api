import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { DoctorFactory } from 'test/factories/make-doctor';

describe('Fetch all doctors (e2e)', () => {
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

  test('[GET] /doctors', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    await doctorFactory.makePrismaDoctor({
      subscriptionId: subscription.id,
      name: 'Test doctor 1',
    });

    await doctorFactory.makePrismaDoctor({
      subscriptionId: subscription.id,
      name: 'Test doctor 2',
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .get('/doctors')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        doctors: [
          expect.objectContaining({
            name: 'Test doctor 1',
          }),
          expect.objectContaining({
            name: 'Test doctor 2',
          }),
        ],
      }),
    );
  });
});
