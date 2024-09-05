import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CreateAdministratorAccountUseCase } from '@/domain/registrations/application/use-cases/create-administrator-account';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateAdministratorAccountController } from './controllers/create-account.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUseCase } from '@/domain/registrations/application/use-cases/authenticate';
import { CreateGroupController } from './controllers/create-group.controller';
import { CreateGroupUseCase } from '@/domain/registrations/application/use-cases/create-group';
import { FetchAllGroupsController } from './controllers/fetch-all-groups.controller';
import { FetchAllGroupsUseCase } from '@/domain/registrations/application/use-cases/fetch-all-groups';
import { DeleteGroupController } from './controllers/delete-group.controller';
import { DeleteGroupUseCase } from '@/domain/registrations/application/use-cases/delete-group';
import { EditGroupController } from './controllers/edit-group.controller';
import { EditGroupUseCase } from '@/domain/registrations/application/use-cases/edit-group';
import { CreateEmployerController } from './controllers/create-employer.controller';
import { CreateEmployerUseCase } from '@/domain/registrations/application/use-cases/create-employer';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [
    CreateAdministratorAccountUseCase,
    AuthenticateUseCase,
    CreateGroupUseCase,
    FetchAllGroupsUseCase,
    DeleteGroupUseCase,
    EditGroupUseCase,
    CreateEmployerUseCase,
  ],
  controllers: [
    CreateAdministratorAccountController,
    AuthenticateController,
    CreateGroupController,
    FetchAllGroupsController,
    DeleteGroupController,
    EditGroupController,
    CreateEmployerController,
  ],
})
export class HttpModule {}
