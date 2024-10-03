import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { BranchWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/branch-with-details';
import {
  Branch as PrismaBranch,
  Employer as PrismaEmployer,
  Address as PrismaAddress,
} from '@prisma/client';

type PrismaBranchWithDetails = PrismaBranch & {
  employer: PrismaEmployer;
  address: PrismaAddress;
};

export class PrismaBranchDetailsMapper {
  static toDomain(raw: PrismaBranchWithDetails): BranchWithDetails {
    return BranchWithDetails.create({
      subscriptionId: new UniqueEntityID(raw.subscriptionId),
      branchId: new UniqueEntityID(raw.id),
      name: raw.name,
      employer: {
        employerId: new UniqueEntityID(raw.employer.id),
        nomeFantasia: raw.employer.nomeFantasia,
        razaoSocial: raw.employer.razaoSocial,
      },
      address: raw.address
        ? {
            addressId: new UniqueEntityID(raw.address.id),
            cep: raw.address.cep,
            city: raw.address.city,
            district: raw.address.district,
            state: raw.address.state,
            street: raw.address.street,
            complement: raw.address.complement,
            number: raw.address.number,
          }
        : null,
    });
  }
}
