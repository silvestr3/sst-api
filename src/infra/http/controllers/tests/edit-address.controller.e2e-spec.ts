import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AddressFactory } from 'test/factories/make-address';
import { AdministratorFactory } from 'test/factories/make-administrator';

describe('Edit address (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let addressFactory: AddressFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [AdministratorFactory, PrismaService, AddressFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    addressFactory = app.get(AddressFactory);

    await app.init();
  });

  test('[PATCH] /addresses/:addressId', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { address } = await addressFactory.makePrismaAddress({
      subscriptionId: subscription.id,
      city: 'Luziânia',
    });

    const token = jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .patch(`/addresses/${address.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        city: 'Cristalina',
      });

    expect(response.statusCode).toEqual(204);

    const addressOnDb = await prisma.address.findUnique({
      where: {
        id: address.id.toString(),
      },
    });

    expect(addressOnDb).toEqual(
      expect.objectContaining({
        city: 'Cristalina',
        street: address.street,
        state: address.state,
      }),
    );
  });
});
