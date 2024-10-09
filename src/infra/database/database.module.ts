import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AdministratorsRepository } from '@/domain/registrations/application/repositories/administrators-repository';
import { PrismaAdministratorsRepository } from './prisma/repositories/prisma-administrators-repository';
import { SubscriptionsRepository } from '@/domain/registrations/application/repositories/subscriptions-repository';
import { PrismaSubscriptionsRepository } from './prisma/repositories/prisma-subscriptions-repository';
import { AddressesRepository } from '@/domain/registrations/application/repositories/addresses-repository';
import { PrismaAddressesRepository } from './prisma/repositories/prisma-addresses-repository';
import { BranchesRepository } from '@/domain/registrations/application/repositories/branches-repository';
import { PrismaBranchesRepository } from './prisma/repositories/prisma-branches-repository';
import { DepartmentsRepository } from '@/domain/registrations/application/repositories/departments-repository';
import { PrismaDepartmentsRepository } from './prisma/repositories/prisma-departments-repository';
import { DoctorsRepository } from '@/domain/registrations/application/repositories/doctors-repository';
import { PrismaDoctorsRepository } from './prisma/repositories/prisma-doctors-repository';
import { EmployeesRepository } from '@/domain/registrations/application/repositories/employees-repository';
import { PrismaEmployeesRepository } from './prisma/repositories/prisma-employees-repository';
import { EmployersRepository } from '@/domain/registrations/application/repositories/employers-repository';
import { PrismaEmployersRepository } from './prisma/repositories/prisma-employers-repository';
import { GroupsRepository } from '@/domain/registrations/application/repositories/groups-repository';
import { PrismaGroupsRepository } from './prisma/repositories/prisma-groups-repository';
import { PositionsRepository } from '@/domain/registrations/application/repositories/positions-repository';
import { PrismaPositionsRepository } from './prisma/repositories/prisma-positions-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: AdministratorsRepository,
      useClass: PrismaAdministratorsRepository,
    },
    {
      provide: SubscriptionsRepository,
      useClass: PrismaSubscriptionsRepository,
    },
    {
      provide: AddressesRepository,
      useClass: PrismaAddressesRepository,
    },
    {
      provide: BranchesRepository,
      useClass: PrismaBranchesRepository,
    },
    {
      provide: DepartmentsRepository,
      useClass: PrismaDepartmentsRepository,
    },
    {
      provide: DoctorsRepository,
      useClass: PrismaDoctorsRepository,
    },
    {
      provide: EmployeesRepository,
      useClass: PrismaEmployeesRepository,
    },
    {
      provide: EmployersRepository,
      useClass: PrismaEmployersRepository,
    },
    {
      provide: GroupsRepository,
      useClass: PrismaGroupsRepository,
    },
    {
      provide: PositionsRepository,
      useClass: PrismaPositionsRepository,
    },
  ],
  exports: [
    PrismaService,
    AdministratorsRepository,
    SubscriptionsRepository,
    AddressesRepository,
    BranchesRepository,
    DepartmentsRepository,
    DoctorsRepository,
    EmployeesRepository,
    EmployersRepository,
    GroupsRepository,
    PositionsRepository,
  ],
})
export class DatabaseModule {}
