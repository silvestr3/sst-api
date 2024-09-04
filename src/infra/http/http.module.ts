import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CreateAdministratorAccountUseCase } from '@/domain/registrations/application/use-cases/create-administrator-account';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateAdministratorAccountController } from './controllers/create-account.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [CreateAdministratorAccountUseCase],
  controllers: [CreateAdministratorAccountController],
})
export class HttpModule {}
