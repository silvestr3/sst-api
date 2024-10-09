import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { PositionFactory } from 'test/factories/make-position';
import { EmployerFactory } from 'test/factories/make-employer';
import { GroupFactory } from 'test/factories/make-group';

describe('Search position by name (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let positionFactory: PositionFactory;
  let groupFactory: GroupFactory;
  let employerFactory: EmployerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        PositionFactory,
        GroupFactory,
        EmployerFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    positionFactory = app.get(PositionFactory);
    groupFactory = app.get(GroupFactory);
    employerFactory = app.get(EmployerFactory);

    await app.init();
  });

  test('[GET] /positions/search', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { subscription: subscription2 } =
      await administratorFactory.makePrismaAdministrator();

    const { group } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
    });

    const { employer } = await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
      addressId: null,
      responsibleDoctorId: null,
    });

    await positionFactory.makePrismaPosition({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Return 1',
    });

    await positionFactory.makePrismaPosition({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Return 2',
    });

    await positionFactory.makePrismaPosition({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Return 3',
    });

    await positionFactory.makePrismaPosition({
      subscriptionId: subscription2.id,
      employerId: employer.id,
      name: 'Return 4',
    });

    await positionFactory.makePrismaPosition({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Other',
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .get(`/positions/search/?q=retur&employerId=${employer.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        positions: [
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
