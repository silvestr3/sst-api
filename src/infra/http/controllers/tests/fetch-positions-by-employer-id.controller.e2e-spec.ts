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

describe('Fetch positions from employer (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let groupFactory: GroupFactory;
  let employerFactory: EmployerFactory;
  let positionFactory: PositionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        GroupFactory,
        EmployerFactory,
        PositionFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    groupFactory = app.get(GroupFactory);
    employerFactory = app.get(EmployerFactory);
    positionFactory = app.get(PositionFactory);

    await app.init();
  });

  test('[GET] /employers/:employerId/positions', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { group: group } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
      name: 'Test group 1',
    });

    const { employer } = await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
      nomeFantasia: 'Primeiro',
      responsibleDoctorId: null,
      addressId: null,
    });

    await positionFactory.makePrismaPosition({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Primeiro',
    });

    await positionFactory.makePrismaPosition({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Segundo',
    });

    await positionFactory.makePrismaPosition({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Terceiro',
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const employerId = employer.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/employers/${employerId}/positions`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    const { positions } = response.body;

    expect(response.statusCode).toEqual(200);
    expect(positions).toHaveLength(3);
    expect(response.body).toEqual(
      expect.objectContaining({
        positions: [
          expect.objectContaining({
            name: 'Primeiro',
          }),
          expect.objectContaining({
            name: 'Segundo',
          }),
          expect.objectContaining({
            name: 'Terceiro',
          }),
        ],
      }),
    );
  });
});
