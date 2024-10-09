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

describe('Search branch by name (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let branchFactory: BranchFactory;
  let groupFactory: GroupFactory;
  let employerFactory: EmployerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        BranchFactory,
        GroupFactory,
        EmployerFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    branchFactory = app.get(BranchFactory);
    groupFactory = app.get(GroupFactory);
    employerFactory = app.get(EmployerFactory);

    await app.init();
  });

  test('[GET] /branches/search', async () => {
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

    const { employer } = await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
      addressId: null,
      responsibleDoctorId: null,
    });

    await branchFactory.makePrismaBranch({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Return 1',
    });

    await branchFactory.makePrismaBranch({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Return 2',
    });

    await branchFactory.makePrismaBranch({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Return 3',
    });

    await branchFactory.makePrismaBranch({
      subscriptionId: subscription2.id,
      employerId: employer.id,
      name: 'Return 4',
    });

    await branchFactory.makePrismaBranch({
      subscriptionId: subscription.id,
      employerId: employer.id,
      name: 'Other',
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .get(`/branches/search/?q=return&employerId=${employer.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        branches: [
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
