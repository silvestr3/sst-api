import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Administrator } from '@/domain/registrations/enterprise/entities/administrator';
import { Cpf } from '@/domain/registrations/enterprise/entities/value-objects/cpf';
import { User } from '@prisma/client';

export class PrismaAdministratorMapper {
  static toDomain(raw: User): Administrator {
    return Administrator.create(
      {
        subscriptionId: new UniqueEntityID(raw.subscriptionId),
        email: raw.email,
        password: raw.password,
        name: raw.name,
        cpf: Cpf.validateAndCreate(raw.cpf),
        phone: raw.phone,
        profilePictureUrl: raw.profilePictureUrl,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: Administrator): User {
    return {
      id: raw.id.toString(),
      subscriptionId: raw.subscriptionId ? raw.subscriptionId.toString() : null,
      email: raw.email,
      password: raw.password,
      name: raw.name,
      cpf: raw.cpf.value,
      phone: raw.phone,
      profilePictureUrl: raw.profilePictureUrl,
    };
  }
}
