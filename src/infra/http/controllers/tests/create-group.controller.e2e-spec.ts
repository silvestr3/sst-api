import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';

describe('Create group (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [AdministratorFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);

    await app.init();
  });

  test('[POST] /groups', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .post('/groups')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test group',
        description: 'Test gorup description',
      });

    expect(response.statusCode).toEqual(201);

    const groupOnDatabase = await prisma.group.findFirst({
      where: {
        name: 'Test group',
      },
    });

    expect(groupOnDatabase).toEqual(
      expect.objectContaining({
        subscriptionId: subscription.id.toString(),
        name: 'Test group',
        description: 'Test gorup description',
        isActive: true,
      }),
    );
  });
});
