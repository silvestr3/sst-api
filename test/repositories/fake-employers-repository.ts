import { EmployersRepository } from '@/domain/registrations/application/repositories/employers-repository';
import { Employer } from '@/domain/registrations/enterprise/entities/employer';
import { EmployerWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/employer-with-details';
import { FakeAddressesRepository } from './fake-addresses-repository';
import { FakeDoctorsRepository } from './fake-doctors-repository';
import { Address } from '@/domain/registrations/enterprise/entities/address';
import { Doctor } from '@/domain/registrations/enterprise/entities/doctor';

export class FakeEmployersRepository implements EmployersRepository {
  constructor(
    private addressesRepository: FakeAddressesRepository,
    private doctorsRepository: FakeDoctorsRepository,
  ) {}

  public items: Employer[] = [];

  async create(employer: Employer): Promise<void> {
    this.items.push(employer);
  }

  async save(employer: Employer): Promise<void> {
    const index = this.items.findIndex((item) => employer.id.equals(item.id));

    this.items[index] = employer;
  }

  async findById(id: string): Promise<Employer | null> {
    const group = this.items.find((item) => item.id.toString() === id);

    return group ?? null;
  }

  async fetchByGroupId(groupId: string): Promise<Employer[]> {
    const employers = this.items.filter(
      (item) => item.groupId.toString() === groupId,
    );

    return employers;
  }

  async findByIdWithDetails(id: string): Promise<EmployerWithDetails | null> {
    let address: Address;
    let doctor: Doctor;

    const employer = this.items.find((item) => item.id.toString() === id);

    if (!employer) {
      return null;
    }

    if (employer.addressId) {
      address = this.addressesRepository.items.find((item) =>
        item.id.equals(employer.addressId),
      );
    }

    if (employer.responsibleDoctorId) {
      doctor = this.doctorsRepository.items.find((item) =>
        item.id.equals(employer.responsibleDoctorId),
      );
    }

    return EmployerWithDetails.create({
      subscriptionId: employer.subscriptionId,
      employerId: employer.id,
      nomeFantasia: employer.nomeFantasia,
      razaoSocial: employer.razaoSocial,
      eSocialEnrollmentType: employer.eSocialEnrollmentType,
      cnpj: employer.cnpj,
      cpf: employer.cpf,
      activity: employer.activity,
      cnae: employer.cnae,
      isActive: employer.isActive,
      riskLevel: employer.riskLevel,
      address: address
        ? {
            addressId: address.id,
            cep: address.cep,
            city: address.city,
            district: address.district,
            state: address.state,
            street: address.street,
            complement: address.complement,
            number: address.number,
          }
        : null,
      responsibleDoctor: doctor
        ? {
            doctorId: doctor.id,
            name: doctor.name,
            phone: doctor.phone,
          }
        : null,
    });
  }

  async searchByName(
    subscriptionId: string,
    searchTerm: string,
    groupId?: string,
  ): Promise<Employer[]> {
    const employers = this.items
      .filter((item) => {
        return (
          item.subscriptionId.toString() === subscriptionId &&
          item.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .filter((item) => {
        if (groupId) {
          return item.groupId.toString() === groupId;
        }
        return item;
      });

    return employers;
  }
}
