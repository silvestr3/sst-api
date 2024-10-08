import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { GroupFactory } from 'test/factories/make-group';

describe('Search group by name (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let groupFactory: GroupFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [AdministratorFactory, PrismaService, GroupFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    groupFactory = app.get(GroupFactory);

    await app.init();
  });

  test('[GET] /groups/search', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { subscription: subscription2 } =
      await administratorFactory.makePrismaAdministrator();

    await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
      name: 'Return 1',
    });

    await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
      name: 'Return 2',
    });

    await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
      name: 'Return 3',
    });

    await groupFactory.makePrismaGroup({
      subscriptionId: subscription2.id,
      name: 'Return 4',
    });

    await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
      name: 'Other',
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .get(`/groups/search?q=return`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        groups: [
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
