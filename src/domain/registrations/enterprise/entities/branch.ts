import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface BranchProps {
  subscriptionId: UniqueEntityID;
  employerId: UniqueEntityID;
  name: string;
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

  static create(props: BranchProps, id?: UniqueEntityID) {
    return new Branch(props, id);
  }
}
