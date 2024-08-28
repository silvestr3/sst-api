import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface PositionProps {
  subscriptionId: UniqueEntityID;
  employerId: UniqueEntityID;
  name: string;
  description: string;
  cbo: string;
  isActive: boolean;
}

export class Position extends Entity<PositionProps> {
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

  get cbo() {
    return this.props.cbo;
  }

  set cbo(cbo: string) {
    this.props.cbo = cbo;
  }

  get isActive() {
    return this.props.isActive;
  }

  set isActive(isActive: boolean) {
    this.props.isActive = isActive;
  }

  static create(props: PositionProps, id?: UniqueEntityID) {
    return new Position(props, id);
  }
}
