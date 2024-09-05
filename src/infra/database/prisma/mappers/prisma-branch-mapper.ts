import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Branch } from '@/domain/registrations/enterprise/entities/branch';
import { Branch as PrismaBranch } from '@prisma/client';

export class PrismaBranchMapper {
  static toDomain(raw: PrismaBranch): Branch {
    return Branch.create(
      {
        subscriptionId: new UniqueEntityID(raw.subscriptionId),
        employerId: new UniqueEntityID(raw.employerId),
        addressId: raw.addressId ? new UniqueEntityID(raw.addressId) : null,
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: Branch): PrismaBranch {
    return {
      id: raw.id.toString(),
      subscriptionId: raw.subscriptionId.toString(),
      employerId: raw.employerId.toString(),
      addressId: raw.addressId ? raw.addressId.toString() : null,
      name: raw.name,
    };
  }
}
