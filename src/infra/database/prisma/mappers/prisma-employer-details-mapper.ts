import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Cpf } from '@/domain/registrations/enterprise/entities/value-objects/cpf';
import { EmployerWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/employer-with-details';
import {
  Employer as PrismaEmployer,
  Doctor as PrismaDoctor,
  Address as PrismaAddress,
} from '@prisma/client';

type PrismaEmployerWithDetails = PrismaEmployer & {
  address: PrismaAddress;
  responsibleDoctor: PrismaDoctor;
};

export class PrismaEmployerWithDetailsMapper {
  static toDomain(raw: PrismaEmployerWithDetails): EmployerWithDetails {
    return EmployerWithDetails.create({
      subscriptionId: new UniqueEntityID(raw.subscriptionId),
      employerId: new UniqueEntityID(raw.id),
      responsibleDoctor: raw.responsibleDoctor
        ? {
            doctorId: new UniqueEntityID(raw.responsibleDoctor.id),
            name: raw.responsibleDoctor.name,
            phone: raw.responsibleDoctor.phone,
          }
        : null,
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
      activity: raw.activity,
      cnae: raw.cnae,
      eSocialEnrollmentType: raw.eSocialEnrollmentType,
      isActive: raw.isActive,
      nomeFantasia: raw.nomeFantasia,
      razaoSocial: raw.razaoSocial,
      riskLevel: raw.riskLevel,
      cnpj: raw.cnpj,
      cpf: Cpf.validateAndCreate(raw.cpf),
    });
  }
}
