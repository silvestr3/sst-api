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

describe('Search employer by name (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let employerFactory: EmployerFactory;
  let groupFactory: GroupFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        EmployerFactory,
        GroupFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    employerFactory = app.get(EmployerFactory);
    groupFactory = app.get(GroupFactory);

    await app.init();
  });

  test('[GET] /employers/search', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { subscription: subscription2 } =
      await administratorFactory.makePrismaAdministrator();

    const { group } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
    });

    const { group: group2 } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
    });

    await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
      responsibleDoctorId: null,
      addressId: null,
      nomeFantasia: 'Return 1',
    });

    await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
      responsibleDoctorId: null,
      addressId: null,
      nomeFantasia: 'Return 2',
    });

    await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group2.id,
      responsibleDoctorId: null,
      addressId: null,
      nomeFantasia: 'Return 3',
    });

    await employerFactory.makePrismaEmployer({
      subscriptionId: subscription2.id,
      groupId: group.id,
      responsibleDoctorId: null,
      addressId: null,
      nomeFantasia: 'Return 4',
    });

    await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
      responsibleDoctorId: null,
      addressId: null,
      nomeFantasia: 'Other',
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const responseOnlyName = await request(app.getHttpServer())
      .get(`/employers/search/?q=return`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(responseOnlyName.statusCode).toEqual(200);
    expect(responseOnlyName.body).toEqual(
      expect.objectContaining({
        employers: [
          expect.objectContaining({
            nomeFantasia: 'Return 1',
          }),
          expect.objectContaining({
            nomeFantasia: 'Return 2',
          }),
          expect.objectContaining({
            nomeFantasia: 'Return 3',
          }),
        ],
      }),
    );

    const responseNameAndGroup = await request(app.getHttpServer())
      .get(`/employers/search/?q=return&groupId=${group2.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(responseNameAndGroup.statusCode).toEqual(200);
    expect(responseNameAndGroup.body).toEqual(
      expect.objectContaining({
        employers: [
          expect.objectContaining({
            nomeFantasia: 'Return 3',
          }),
        ],
      }),
    );
  });
});
