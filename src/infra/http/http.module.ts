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
import { CreateEmployeeController } from './controllers/create-employee.controller';
import { CreateEmployeeUseCase } from '@/domain/registrations/application/use-cases/create-employee';
import { EditEmployeeController } from './controllers/edit-employee.controller';
import { EditEmployeeUseCase } from '@/domain/registrations/application/use-cases/edit-employee';
import { FetchAllDoctorsController } from './controllers/fetch-all-doctors.controller';
import { FetchAllDoctorsUseCase } from '@/domain/registrations/application/use-cases/fetch-all-doctors';
import { FetchEmployeesByEmployerIdController } from './controllers/fetch-employees-by-employer-id.controller';
import { FetchEmployeesByEmployerIdUseCase } from '@/domain/registrations/application/use-cases/fetch-employees-by-employer-id';
import { GetEmployerDetailsController } from './controllers/get-employer-details.controller';
import { GetEmployerDetailsUseCase } from '@/domain/registrations/application/use-cases/get-employer-details';
import { GetDepartmentDetailsController } from './controllers/get-department-details.controller';
import { GetDepartmentDetailsUseCase } from '@/domain/registrations/application/use-cases/get-department-details';
import { GetBranchDetailsController } from './controllers/get-branch-details.controller';
import { GetBranchDetailsUseCase } from '@/domain/registrations/application/use-cases/get-branch-details';
import { GetPositionDetailsController } from './controllers/get-position-details.controller';
import { GetPositionDetailsUseCase } from '@/domain/registrations/application/use-cases/get-position-details';
import { GetEmployeeDetailsController } from './controllers/get-employee-details.controller';
import { GetEmployeeDetailsUseCase } from '@/domain/registrations/application/use-cases/get-employee-details';
import { SearchGroupsByNameController } from './controllers/search-group-by-name.controller';
import { SearchGroupsByNameUseCase } from '@/domain/registrations/application/use-cases/search-group-by-name';
import { SearchEmployersByNameController } from './controllers/search-employer-by-name.controller';
import { SearchEmployersByNameUseCase } from '@/domain/registrations/application/use-cases/search-employer-by-name';
import { SearchBranchesByNameController } from './controllers/search-branch-by-name.controller';
import { SearchBranchesByNameUseCase } from '@/domain/registrations/application/use-cases/search-branch-by-name';
import { SearchDepartmentsByNameController } from './controllers/search-department-by-name.controller';
import { SearchDepartmentsByNameUseCase } from '@/domain/registrations/application/use-cases/search-department-by-name';
import { SearchPositionsByNameController } from './controllers/search-positions-by-name.controller';
import { SearchPositionsByNameUseCase } from '@/domain/registrations/application/use-cases/search-positions-by-name';
import { SearchDoctorsByNameController } from './controllers/search-doctors-by-name.controller';
import { SearchDoctorsByNameUseCase } from '@/domain/registrations/application/use-cases/search-doctors-by-name';

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
    CreateEmployeeUseCase,
    EditEmployeeUseCase,
    FetchAllDoctorsUseCase,
    FetchEmployeesByEmployerIdUseCase,
    GetEmployerDetailsUseCase,
    GetDepartmentDetailsUseCase,
    GetBranchDetailsUseCase,
    GetPositionDetailsUseCase,
    GetEmployeeDetailsUseCase,
    SearchGroupsByNameUseCase,
    SearchEmployersByNameUseCase,
    SearchBranchesByNameUseCase,
    SearchDepartmentsByNameUseCase,
    SearchPositionsByNameUseCase,
    SearchDoctorsByNameUseCase,
  ],
  controllers: [
    // ACCOUNTS
    CreateAdministratorAccountController,
    AuthenticateController,

    // GROUPS
    CreateGroupController,
    FetchAllGroupsController,
    DeleteGroupController,
    EditGroupController,
    FetchEmployersByGroupIdController,
    SearchGroupsByNameController,

    // EMPLOYERS
    GetEmployerDetailsController,
    SearchEmployersByNameController,
    CreateEmployerController,
    InactivateEmployerController,
    LinkAddressToEmployerController,
    LinkDoctorToEmployerController,
    CreateDepartmentController,
    CreateBranchController,
    CreatePositionController,
    CreateEmployeeController,
    FetchDepartmentsByEmployerIdController,
    FetchBranchesByEmployerIdController,
    FetchPositionsByEmployerIdController,
    FetchEmployeesByEmployerIdController,

    // DEPARTMENTS
    GetDepartmentDetailsController,
    SearchDepartmentsByNameController,
    EditDepartmentController,

    // BRANCHES
    GetBranchDetailsController,
    SearchBranchesByNameController,
    LinkAddressToBranchController,
    EditBranchController,

    // POSITIONS
    GetPositionDetailsController,
    SearchPositionsByNameController,
    EditPositionController,

    // EMPLOYEES
    GetEmployeeDetailsController,
    EditEmployeeController,

    // DOCTORS
    FetchAllDoctorsController,
    SearchDoctorsByNameController,
    CreateDoctorController,
    EditDoctorController,

    // ADDRESSES
    CreateAddressController,
    EditAddressController,
  ],
})
export class HttpModule {}
