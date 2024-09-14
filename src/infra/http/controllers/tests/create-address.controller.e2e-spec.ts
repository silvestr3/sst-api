import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { GroupFactory } from 'test/factories/make-group';

describe('Create address (e2e)', () => {
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

  test('[POST] /addresses', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cep: '12312123',
        street: 'Rua dos patos',
        district: 'Pq estrela  dalva',
        city: 'Luziânia',
        state: 'GO',
        number: '123',
      });

    expect(response.statusCode).toEqual(201);

    expect(response.body).toEqual({
      address: expect.objectContaining({
        id: expect.any(String),
      }),
    });

    const addressOnDb = await prisma.address.findFirst({
      where: {
        street: 'Rua dos patos',
      },
    });

    expect(addressOnDb).toBeTruthy();
    expect(addressOnDb).toEqual(
      expect.objectContaining({
        district: 'Pq estrela  dalva',
        city: 'Luziânia',
        state: 'GO',
        number: '123',
      }),
    );
  });
});
