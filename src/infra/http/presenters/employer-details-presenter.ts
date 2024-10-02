import { EmployerDetailsDTO } from '../dto/get-employer-details.dto';
import { EmployerWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/employer-with-details';

export class EmployerDetailsPresenter {
  static toHttp(employer: EmployerWithDetails): EmployerDetailsDTO {
    return {
      id: employer.employerId.toString(),
      eSocialEnrollmentType: employer.eSocialEnrollmentType,
      cpf: employer.cpf ? employer.cpf.value : undefined,
      cnpj: employer.cnpj ?? undefined,
      razaoSocial: employer.razaoSocial,
      nomeFantasia: employer.nomeFantasia,
      cnae: employer.cnae,
      activity: employer.activity,
      riskLevel: employer.riskLevel,
      isActive: employer.isActive,
      responsibleDoctor: employer.responsibleDoctor
        ? {
            doctorId: employer.responsibleDoctor.doctorId.toString(),
            name: employer.responsibleDoctor.name,
            phone: employer.responsibleDoctor.phone,
          }
        : undefined,
      address: employer.address
        ? {
            addressId: employer.address.addressId.toString(),
            cep: employer.address.cep,
            city: employer.address.cep,
            district: employer.address.district,
            state: employer.address.state,
            street: employer.address.street,
            complement: employer.address.complement,
            number: employer.address.number,
          }
        : undefined,
    };
  }
}
