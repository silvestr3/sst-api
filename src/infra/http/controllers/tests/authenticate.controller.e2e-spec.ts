import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';

describe('Authenticate (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let administratorFactory: AdministratorFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AdministratorFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    administratorFactory = app.get(AdministratorFactory);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await administratorFactory.makePrismaAdministrator({
      email: 'johndoe@email.com',
      password: await hash('12345678', 8),
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@email.com',
      password: '12345678',
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    );
  });
});
