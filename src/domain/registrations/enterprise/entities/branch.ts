import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface BranchProps {
  subscriptionId: UniqueEntityID;
  employerId: UniqueEntityID;
  name: string;
  addressId?: UniqueEntityID | null;
}

export class Branch extends Entity<BranchProps> {
  get subscriptionId() {
    return this.props.subscriptionId;
  }

  get employerId() {
    return this.props.employerId;
  }

  set employerId(employerId: UniqueEntityID) {
    this.props.employerId = employerId;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get addressId() {
    return this.props.addressId;
  }

  set addressId(addressId: UniqueEntityID) {
    this.props.addressId = addressId;
  }

  static create(props: BranchProps, id?: UniqueEntityID) {
    return new Branch(props, id);
  }
}
