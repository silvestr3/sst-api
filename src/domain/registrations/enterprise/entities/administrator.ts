import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface AdministratorProps {
  subscriptionId: UniqueEntityID;
  email: string;
  password: string;
  name: string;
  cpf: string;
  phone?: string;
  profilePictureUrl: string;
}

export class Administrator extends Entity<AdministratorProps> {
  get subscriptionId() {
    return this.props.subscriptionId;
  }

  set subscriptionId(subscriptionId: UniqueEntityID) {
    this.props.subscriptionId = subscriptionId;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get cpf() {
    return this.props.cpf;
  }

  set cpf(cpf: string) {
    this.props.cpf = cpf;
  }

  get phone() {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
  }

  get profilePictureUrl() {
    return this.props.profilePictureUrl;
  }

  set profilePictureUrl(profilePictureUrl: string) {
    this.props.profilePictureUrl = profilePictureUrl;
  }

  static create(props: AdministratorProps, id?: UniqueEntityID) {
    return new Administrator(props, id);
  }
}
