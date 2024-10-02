import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Address } from '@/domain/registrations/enterprise/entities/address';
import { Doctor } from '@/domain/registrations/enterprise/entities/doctor';
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
    const responsibleDoctor = Doctor.create({
        name:raw.responsibleDoctor.name,
        crm: raw.responsibleDoctor.crm,
        phone: raw.responsibleDoctor.phone,
        subscriptionId: 
    })



    return EmployerWithDetails.create({
      subscriptionId: new UniqueEntityID(raw.subscriptionId),
      employerId: new UniqueEntityID(raw.id),
      responsibleDoctor: Doctor.create(
        raw.responsibleDoctor,
        raw.responsibleDoctor.id,
      ),
      address: Address.create(raw.address, raw.address.id),
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
