import { Employer } from '@/domain/registrations/enterprise/entities/employer';
import { EmployerObject } from '../dto/fetch-employers-by-group-id.dto';

export class EmployerPresenter {
  static toHttp(employer: Employer): EmployerObject {
    return {
      id: employer.id.toString(),
      eSocialEnrollmentType: employer.eSocialEnrollmentType,
      cpf: employer.cpf ? employer.cpf.value : undefined,
      cnpj: employer.cnpj ?? undefined,
      razaoSocial: employer.razaoSocial,
      nomeFantasia: employer.nomeFantasia,
      cnae: employer.cnae,
      activity: employer.activity,
      riskLevel: employer.riskLevel,
      isActive: employer.isActive,
      addressId: employer.addressId ? employer.addressId.toString() : undefined,
    };
  }
}
