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

describe('Fetch employers from group (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let groupFactory: GroupFactory;
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

  test('[GET] /groups/:groupId/employers', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { group: group1 } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
      name: 'Test group 1',
    });

    const { group: group2 } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
      name: 'Test group 2',
    });

    await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group1.id,
      nomeFantasia: 'Primeiro',
      responsibleDoctorId: null,
      addressId: null,
    });

    await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group1.id,
      nomeFantasia: 'Segundo',
      responsibleDoctorId: null,
      addressId: null,
    });

    await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group2.id,
      nomeFantasia: 'Outro grupo',
      responsibleDoctorId: null,
      addressId: null,
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const groupId = group1.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/groups/${groupId}/employers`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    const { employers } = response.body;

    expect(response.statusCode).toEqual(200);
    expect(employers).toHaveLength(2);
    expect(response.body).toEqual(
      expect.objectContaining({
        employers: [
          expect.objectContaining({
            nomeFantasia: 'Primeiro',
          }),
          expect.objectContaining({
            nomeFantasia: 'Segundo',
          }),
        ],
      }),
    );
  });
});
