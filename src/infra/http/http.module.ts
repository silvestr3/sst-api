import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateAdministratorAccountUseCase } from '@/domain/registrations/application/use-cases/create-administrator-account';
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
import { FetchEmployersByGroupIdController } from './controllers/fetch-employers-by-group-id.controller';
import { FetchEmployersByGroupIdUseCase } from '@/domain/registrations/application/use-cases/fetch-employers-by-group-id';
import { InactivateEmployerController } from './controllers/inactivate-employer.controller';
import { InactivateEmployerUseCase } from '@/domain/registrations/application/use-cases/inactivate-employer';
import { CreateAddressController } from './controllers/create-address.controller';
import { CreateAddressUseCase } from '@/domain/registrations/application/use-cases/create-address';
import { EditAddressController } from './controllers/edit-address.controller';
import { EditAddressUseCase } from '@/domain/registrations/application/use-cases/edit-address';
import { LinkAddressToEmployerController } from './controllers/link-address-to-employer.controller';
import { LinkAddressToEmployerUseCase } from '@/domain/registrations/application/use-cases/link-address-to-employer';
import { CreateDepartmentController } from './controllers/create-department.controller';
import { CreateDepartmentUseCase } from '@/domain/registrations/application/use-cases/create-department';
import { EditDepartmentController } from './controllers/edit-department.controller';
import { EditDepartmentUseCase } from '@/domain/registrations/application/use-cases/edit-department';
import { FetchDepartmentsByEmployerIdController } from './controllers/fetch-departments-by-employer-id.controller';
import { FetchDepartmentsByEmployerIdUseCase } from '@/domain/registrations/application/use-cases/fetch-departments-by-employer-id';
import { CreateBranchController } from './controllers/create-branch.controller';
import { CreateBranchUseCase } from '@/domain/registrations/application/use-cases/create-branch';
import { FetchBranchesByEmployerIdController } from './controllers/fetch-branches-by-employer-id.controller';
import { FetchBranchesByEmployerIdUseCase } from '@/domain/registrations/application/use-cases/fetch-branches-by-employer-id';
import { LinkAddressToBranchController } from './controllers/link-address-to-branch.controller';
import { LinkAddressToBranchUseCase } from '@/domain/registrations/application/use-cases/link-address-to-branch';
import { EditBranchController } from './controllers/edit-branch.controller';
import { EditBranchUseCase } from '@/domain/registrations/application/use-cases/edit-branch';
import { CreatePositionController } from './controllers/create-position.controller';
import { CreatePositionUseCase } from '@/domain/registrations/application/use-cases/create-position';
import { EditPositionController } from './controllers/edit-position.controller';
import { EditPositionUseCase } from '@/domain/registrations/application/use-cases/edit-position';
import { FetchPositionsByEmployerIdController } from './controllers/fetch-positions-by-employer-id.controller';
import { FetchPositionsByEmployerIdUseCase } from '@/domain/registrations/application/use-cases/fetch-positions-by-employer-id';
import { CreateDoctorController } from './controllers/create-doctor.controller';
import { CreateDoctorUseCase } from '@/domain/registrations/application/use-cases/create-doctor';
import { EditDoctorController } from './controllers/edit-doctor.controller';
import { EditDoctorUseCase } from '@/domain/registrations/application/use-cases/edit-doctor';
import { LinkDoctorToEmployerController } from './controllers/link-doctor-to-employer.controller';
import { LinkDoctorToEmployerUseCase } from '@/domain/registrations/application/use-cases/link-doctor-to-employer';

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
    FetchEmployersByGroupIdUseCase,
    InactivateEmployerUseCase,
    CreateAddressUseCase,
    EditAddressUseCase,
    LinkAddressToEmployerUseCase,
    CreateDepartmentUseCase,
    EditDepartmentUseCase,
    FetchDepartmentsByEmployerIdUseCase,
    CreateBranchUseCase,
    FetchBranchesByEmployerIdUseCase,
    LinkAddressToBranchUseCase,
    EditBranchUseCase,
    CreatePositionUseCase,
    EditPositionUseCase,
    FetchPositionsByEmployerIdUseCase,
    CreateDoctorUseCase,
    EditDoctorUseCase,
    LinkDoctorToEmployerUseCase,
  ],
  controllers: [
    CreateAdministratorAccountController,
    AuthenticateController,
    CreateGroupController,
    FetchAllGroupsController,
    DeleteGroupController,
    EditGroupController,
    CreateEmployerController,
    FetchEmployersByGroupIdController,
    InactivateEmployerController,
    CreateAddressController,
    EditAddressController,
    LinkAddressToEmployerController,
    LinkDoctorToEmployerController,
    CreateDepartmentController,
    EditDepartmentController,
    FetchDepartmentsByEmployerIdController,
    CreateBranchController,
    FetchBranchesByEmployerIdController,
    LinkAddressToBranchController,
    EditBranchController,
    CreatePositionController,
    EditPositionController,
    FetchPositionsByEmployerIdController,
    CreateDoctorController,
    EditDoctorController,
  ],
})
export class HttpModule {}
