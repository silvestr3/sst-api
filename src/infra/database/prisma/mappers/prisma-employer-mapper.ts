import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Employer } from '@/domain/registrations/enterprise/entities/employer';
import { Cpf } from '@/domain/registrations/enterprise/entities/value-objects/cpf';
import { Employer as PrismaEmployer } from '@prisma/client';

export class PrismaEmployerMapper {
  static toDomain(raw: PrismaEmployer): Employer {
    return Employer.create(
      {
        subscriptionId: new UniqueEntityID(raw.subscriptionId),
        groupId: new UniqueEntityID(raw.groupId),
        responsibleDoctorId: raw.responsibleDoctorId
          ? new UniqueEntityID(raw.responsibleDoctorId)
          : null,
        addressId: raw.addressId ? new UniqueEntityID(raw.addressId) : null,
        activity: raw.activity,
        cnae: raw.cnae,
        eSocialEnrollmentType: raw.eSocialEnrollmentType,
        cpf: raw.cpf ? Cpf.validateAndCreate(raw.cpf) : null,
        cnpj: raw.cnpj,
        isActive: raw.isActive,
        nomeFantasia: raw.nomeFantasia,
        razaoSocial: raw.razaoSocial,
        riskLevel: raw.riskLevel,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: Employer): PrismaEmployer {
    return {
      id: raw.id.toString(),
      subscriptionId: raw.subscriptionId.toString(),
      groupId: raw.groupId.toString(),
      responsibleDoctorId: raw.responsibleDoctorId.toString() ?? null,
      addressId: raw.addressId.toString() ?? null,
      activity: raw.activity,
      cnae: raw.cnae,
      eSocialEnrollmentType: raw.eSocialEnrollmentType,
      cpf: raw.cpf ? raw.cpf.value : null,
      cnpj: raw.cnpj,
      isActive: raw.isActive,
      nomeFantasia: raw.nomeFantasia,
      razaoSocial: raw.razaoSocial,
      riskLevel: raw.riskLevel,
    };
  }
}
