import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface DepartmentProps {
  subscriptionId: UniqueEntityID;
  employerId: UniqueEntityID;
  name: string;
  description: string;
}

export class Department extends Entity<DepartmentProps> {
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

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
  }

  static create(props: DepartmentProps, id?: UniqueEntityID) {
    return new Department(props, id);
  }
}
