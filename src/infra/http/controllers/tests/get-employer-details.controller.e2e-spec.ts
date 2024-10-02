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
import { AddressFactory } from 'test/factories/make-address';
import { DoctorFactory } from 'test/factories/make-doctor';

describe('Get employer details (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let groupFactory: GroupFactory;
  let employerFactory: EmployerFactory;
  let addressFactory: AddressFactory;
  let doctorFactory: DoctorFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        GroupFactory,
        EmployerFactory,
        AddressFactory,
        DoctorFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    groupFactory = app.get(GroupFactory);
    employerFactory = app.get(EmployerFactory);
    addressFactory = app.get(AddressFactory);
    doctorFactory = app.get(DoctorFactory);

    await app.init();
  });

  test('[GET] /employers/:employerId', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { group: group } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
      name: 'Test group 1',
    });

    const { address } = await addressFactory.makePrismaAddress({
      subscriptionId: subscription.id,
    });

    const { doctor } = await doctorFactory.makePrismaDoctor({
      subscriptionId: subscription.id,
    });

    const { employer } = await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
      nomeFantasia: 'Primeiro',
      responsibleDoctorId: doctor.id,
      addressId: address.id,
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const employerId = employer.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/employers/${employerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        employer: expect.objectContaining({
          id: employer.id.toString(),
          address: expect.objectContaining({
            addressId: address.id.toString(),
          }),
          responsibleDoctor: expect.objectContaining({
            doctorId: doctor.id.toString(),
            name: doctor.name,
          }),
        }),
      }),
    );
  });
});
