import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CreateAdministratorAccountUseCase } from '@/domain/registrations/application/use-cases/create-administrator-account';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateAdministratorAccountController } from './controllers/create-account.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUseCase } from '@/domain/registrations/application/use-cases/authenticate';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [CreateAdministratorAccountUseCase, AuthenticateUseCase],
  controllers: [CreateAdministratorAccountController, AuthenticateController],
})
export class HttpModule {}
