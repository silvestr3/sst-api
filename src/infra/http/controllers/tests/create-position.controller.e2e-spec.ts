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

describe('Create position (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let groupFactory: GroupFactory;
  let administratorFactory: AdministratorFactory;
  let employerFactory: EmployerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        GroupFactory,
        EmployerFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    groupFactory = app.get(GroupFactory);
    employerFactory = app.get(EmployerFactory);

    await app.init();
  });

  test('[POST] /employers/:employerId/positions', async () => {
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

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const employerId = employer.id.toString();

    const response = await request(app.getHttpServer())
      .post(`/employers/${employerId}/positions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Testing Position',
        description: 'Position for end-to-end tests',
        cbo: '12345',
      });

    expect(response.statusCode).toEqual(201);

    expect(response.body).toEqual({
      position: expect.objectContaining({
        id: expect.any(String),
        isActive: true,
      }),
    });

    const positionOnDb = await prisma.position.findFirst({
      where: {
        name: 'Testing Position',
      },
    });

    expect(positionOnDb).toBeTruthy();
    expect(positionOnDb).toEqual(
      expect.objectContaining({
        employerId: employer.id.toString(),
        name: 'Testing Position',
        description: 'Position for end-to-end tests',
        isActive: true,
      }),
    );
  });
});
