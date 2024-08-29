import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface EmployerProps {
  subscriptionId: UniqueEntityID;
  groupId: UniqueEntityID;
  eSocialEnrollmentType: 'CPF' | 'CNPJ';
  cpf?: string | null;
  cnpj?: string | null;
  razaoSocial: string;
  nomeFantasia: string;
  cnae: string;
  activity: string;
  riskLevel: number;
  responsibleDoctorId: UniqueEntityID;
  isActive: boolean;
  addressId?: UniqueEntityID;
}

export class Employer extends Entity<EmployerProps> {
  get subscriptionId() {
    return this.props.subscriptionId;
  }

  get groupId() {
    return this.props.groupId;
  }

  set groupId(id: UniqueEntityID) {
    this.props.groupId = id;
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

  set cpf(cpf: string) {
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

  get responsibleDoctorId() {
    return this.props.responsibleDoctorId;
  }

  set responsibleDoctorId(responsibleDoctorId: UniqueEntityID) {
    this.props.responsibleDoctorId = responsibleDoctorId;
  }

  get isActive() {
    return this.props.isActive;
  }

  set isActive(isActive: boolean) {
    this.props.isActive = isActive;
  }

  get addressId() {
    return this.props.addressId;
  }

  set addressId(addressId: UniqueEntityID) {
    this.props.addressId = addressId;
  }

  static create(props: EmployerProps, id?: UniqueEntityID) {
    return new Employer(props, id);
  }
}
