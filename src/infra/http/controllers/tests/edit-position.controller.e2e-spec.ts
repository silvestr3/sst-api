import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { EmployerFactory } from 'test/factories/make-employer';
import { GroupFactory } from 'test/factories/make-group';
import { PositionFactory } from 'test/factories/make-position';

describe('Edit position (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let groupFactory: GroupFactory;
  let administratorFactory: AdministratorFactory;
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

  test('[PATCH] /positions/:positionId', async () => {
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

    const { position } = await positionFactory.makePrismaPosition({
      subscriptionId: subscription.id,
      employerId: employer.id,
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const positionId = position.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/positions/${positionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Testing Position',
      });

    expect(response.statusCode).toEqual(204);

    const positionOnDb = await prisma.position.findUnique({
      where: {
        id: position.id.toString(),
      },
    });

    expect(positionOnDb).toBeTruthy();
    expect(positionOnDb).toEqual(
      expect.objectContaining({
        employerId: employer.id.toString(),
        name: 'Testing Position',
        description: position.description,
        isActive: position.isActive,
      }),
    );
  });
});
