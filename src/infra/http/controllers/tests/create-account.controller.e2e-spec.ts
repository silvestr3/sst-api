import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create account (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /accounts', async () => {
    const response = request(app.getHttpServer()).post('/accounts').send({
      email: 'john.doe@test.com',
      password: '12345678',
      name: 'John Doe',
      cpf: '75663563059',
    });

    expect((await response).statusCode).toEqual(201);

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        name: 'John Doe',
      },
    });

    expect(userOnDatabase).toEqual(
      expect.objectContaining({
        email: 'john.doe@test.com',
        name: 'John Doe',
      }),
    );

    const subscriptionOnDatabase = await prisma.subscription.findFirst();
    expect(subscriptionOnDatabase.administratorId).toEqual(userOnDatabase.id);
  });
});
