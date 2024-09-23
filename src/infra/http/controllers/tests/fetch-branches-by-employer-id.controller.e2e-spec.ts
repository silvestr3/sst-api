import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { BranchFactory } from 'test/factories/make-branch';
import { EmployerFactory } from 'test/factories/make-employer';
import { GroupFactory } from 'test/factories/make-group';

describe('Fetch branches from employer (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let groupFactory: GroupFactory;
  let employerFactory: EmployerFactory;
  let branchFactory: BranchFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        GroupFactory,
        EmployerFactory,
        BranchFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    groupFactory = app.get(GroupFactory);
    employerFactory = app.get(EmployerFactory);
    branchFactory = app.get(BranchFactory);

    await app.init();
  });

  test('[GET] /employers/:employerId/departments', async () => {
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

    await branchFactory.makePrismaBranch({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Primeiro',
    });

    await branchFactory.makePrismaBranch({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Segundo',
    });

    await branchFactory.makePrismaBranch({
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
      .get(`/employers/${employerId}/branches`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    const { branches } = response.body;

    expect(response.statusCode).toEqual(200);
    expect(branches).toHaveLength(3);
    expect(response.body).toEqual(
      expect.objectContaining({
        branches: [
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
