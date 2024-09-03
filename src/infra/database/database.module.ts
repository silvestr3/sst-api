import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AdministratorsRepository } from '@/domain/registrations/application/repositories/administrators-repository';
import { PrismaAdministratorsRepository } from './repositories/prisma-administrators-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: AdministratorsRepository,
      useClass: PrismaAdministratorsRepository,
    },
  ],
  exports: [PrismaService, AdministratorsRepository],
})
export class DatabaseModule {}
