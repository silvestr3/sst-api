import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface AddressProps {
  subscriptionId: UniqueEntityID;
  cep: string;
  street: string;
  complement: string;
  number?: number;
  district: string;
  city: string;
  state: string;
}

export class Address extends Entity<AddressProps> {
  get subscriptionId() {
    return this.props.subscriptionId;
  }

  get cep() {
    return this.props.cep;
  }

  set cep(cep: string) {
    this.props.cep = cep;
  }

  get street() {
    return this.props.street;
  }

  set street(street: string) {
    this.props.street = street;
  }

  get complement() {
    return this.props.complement;
  }

  set complement(complement: string) {
    this.props.complement = complement;
  }

  get number() {
    return this.props.number;
  }

  set number(number: number) {
    this.props.number = number;
  }

  get district() {
    return this.props.district;
  }

  set district(district: string) {
    this.props.district = district;
  }

  get city() {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
  }

  get state() {
    return this.props.state;
  }

  set state(state: string) {
    this.props.state = state;
  }

  static create(props: AddressProps, id?: UniqueEntityID) {
    return new Address(props, id);
  }
}
