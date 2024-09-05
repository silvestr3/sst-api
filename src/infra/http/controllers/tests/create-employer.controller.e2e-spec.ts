import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { GroupFactory } from 'test/factories/make-group';

describe('Create employer (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let groupFactory: GroupFactory;
  let administratorFactory: AdministratorFactory;

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

  test('[POST] /employers', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const { group } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
    });

    const response = await request(app.getHttpServer())
      .post('/employers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        groupId: group.id.toString(),
        eSocialEnrollmentType: 'CPF',
        cpf: '41975803043',
        razaoSocial: 'Empresa teste',
        nomeFantasia: 'Empresa teste',
        cnae: '12345',
        activity: 'Realização de testes',
        riskLevel: 5,
      });

    expect(response.statusCode).toEqual(201);

    const employerOnDatabase = await prisma.employer.findFirst({
      where: {
        razaoSocial: 'Empresa teste',
      },
    });

    const branchOnDatabase = await prisma.branch.findFirst({
      where: {
        employerId: employerOnDatabase.id,
      },
    });

    expect(employerOnDatabase).toEqual(
      expect.objectContaining({
        subscriptionId: subscription.id.toString(),
        razaoSocial: 'Empresa teste',
        isActive: true,
      }),
    );
    expect(branchOnDatabase).toEqual(
      expect.objectContaining({
        employerId: employerOnDatabase.id.toString(),
        name: 'Sede',
      }),
    );
  });
});
