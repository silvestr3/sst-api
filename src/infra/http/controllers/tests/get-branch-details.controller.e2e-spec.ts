import { AppModule } from '@/infra/app.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { BranchFactory } from 'test/factories/make-branch';
import { GroupFactory } from 'test/factories/make-group';
import { AddressFactory } from 'test/factories/make-address';
import { DoctorFactory } from 'test/factories/make-doctor';
import { EmployerFactory } from 'test/factories/make-employer';

describe('Get branch details (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let administratorFactory: AdministratorFactory;
  let groupFactory: GroupFactory;
  let branchFactory: BranchFactory;
  let addressFactory: AddressFactory;
  let doctorFactory: DoctorFactory;
  let employerFactory: EmployerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [
        AdministratorFactory,
        PrismaService,
        GroupFactory,
        BranchFactory,
        AddressFactory,
        DoctorFactory,
        EmployerFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = app.get(JwtService);
    administratorFactory = app.get(AdministratorFactory);
    groupFactory = app.get(GroupFactory);
    branchFactory = app.get(BranchFactory);
    addressFactory = app.get(AddressFactory);
    doctorFactory = app.get(DoctorFactory);
    employerFactory = app.get(EmployerFactory);

    await app.init();
  });

  test('[GET] /branches/:branchId', async () => {
    const { administrator, subscription } =
      await administratorFactory.makePrismaAdministrator();

    const { group: group } = await groupFactory.makePrismaGroup({
      subscriptionId: subscription.id,
      name: 'Test group 1',
    });

    const { employer } = await employerFactory.makePrismaEmployer({
      subscriptionId: subscription.id,
      groupId: group.id,
      responsibleDoctorId: null,
      addressId: null,
    });

    const { address } = await addressFactory.makePrismaAddress({
      subscriptionId: subscription.id,
    });

    const { branch } = await branchFactory.makePrismaBranch({
      subscriptionId: subscription.id,
      employerId: employer.id,
      addressId: address.id,
    });

    const token = await jwt.sign({
      sub: administrator.id.toString(),
      subscription: subscription.id.toString(),
    });

    const branchId = branch.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/branches/${branchId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        branch: expect.objectContaining({
          id: branch.id.toString(),
          employer: expect.objectContaining({
            employerId: employer.id.toString(),
            nomeFantasia: employer.nomeFantasia,
          }),
          address: expect.objectContaining({
            addressId: address.id.toString(),
            street: address.street,
          }),
        }),
      }),
    );
  });
});
