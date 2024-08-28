import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface DoctorProps {
  subscriptionId: UniqueEntityID;
  name: string;
  crm: string;
  ufCrm: string;
  phone: string;
}

export class Doctor extends Entity<DoctorProps> {
  get subscriptionId() {
    return this.props.subscriptionId;
  }

  set subscriptionId(subscriptionId: UniqueEntityID) {
    this.props.subscriptionId = subscriptionId;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get crm() {
    return this.props.crm;
  }

  set crm(crm: string) {
    this.props.crm = crm;
  }

  get ufCrm() {
    return this.props.ufCrm;
  }

  set ufCrm(ufCrm: string) {
    this.props.ufCrm = ufCrm;
  }

  get phone() {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
  }

  static create(props: DoctorProps, id?: UniqueEntityID) {
    return new Doctor(props, id);
  }
}
