import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { Cpf } from './cpf';

export interface DoctorInfo {
  doctorId: UniqueEntityID;
  name: string;
  phone: string;
}

export interface AddressInfo {
  addressId: UniqueEntityID;
  cep: string;
  street: string;
  complement?: string;
  number?: string;
  district: string;
  city: string;
  state: string;
}

export interface EmployerWithDetailsProps {
  subscriptionId: UniqueEntityID;
  employerId: UniqueEntityID;
  eSocialEnrollmentType: 'CPF' | 'CNPJ';
  cpf?: Cpf | null;
  cnpj?: string | null;
  razaoSocial: string;
  nomeFantasia: string;
  cnae: string;
  activity: string;
  riskLevel: number;
  isActive: boolean;
  responsibleDoctor: DoctorInfo | null;
  address: AddressInfo | null;
}

export class EmployerWithDetails extends ValueObject<EmployerWithDetailsProps> {
  get subscriptionId() {
    return this.props.subscriptionId;
  }

  get eSocialEnrollmentType() {
    return this.props.eSocialEnrollmentType;
  }

  set eSocialEnrollmentType(eSocialEnrollmentType: 'CPF' | 'CNPJ') {
    this.props.eSocialEnrollmentType = eSocialEnrollmentType;
  }

  get cpf() {
    return this.props.cpf;
  }

  set cpf(cpf: Cpf) {
    this.props.cpf = cpf;
  }

  get cnpj() {
    return this.props.cnpj;
  }

  set cnpj(cnpj: string) {
    this.props.cnpj = cnpj;
  }

  get razaoSocial() {
    return this.props.razaoSocial;
  }

  set razaoSocial(razaoSocial: string) {
    this.props.razaoSocial = razaoSocial;
  }

  get nomeFantasia() {
    return this.props.nomeFantasia;
  }

  set nomeFantasia(nomeFantasia: string) {
    this.props.nomeFantasia = nomeFantasia;
  }

  get cnae() {
    return this.props.cnae;
  }

  set cnae(cnae: string) {
    this.props.cnae = cnae;
  }

  get activity() {
    return this.props.activity;
  }

  set activity(activity: string) {
    this.props.activity = activity;
  }

  get riskLevel() {
    return this.props.riskLevel;
  }

  set riskLevel(riskLevel: number) {
    this.props.riskLevel = riskLevel;
  }

  get responsibleDoctor() {
    return this.props.responsibleDoctor;
  }

  set responsibleDoctor(responsibleDoctor: DoctorInfo) {
    this.props.responsibleDoctor = responsibleDoctor;
  }

  get isActive() {
    return this.props.isActive;
  }

  set isActive(isActive: boolean) {
    this.props.isActive = isActive;
  }

  get address() {
    return this.props.address;
  }

  set address(address: AddressInfo) {
    this.props.address = address;
  }

  static create(props: EmployerWithDetailsProps) {
    return new EmployerWithDetails(props);
  }
}
