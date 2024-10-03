import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { EmployerInfo } from './department-with-details';

export interface PositionWithDetailsProps {
  subscriptionId: UniqueEntityID;
  positionId: UniqueEntityID;
  name: string;
  description: string;
  cbo: string;
  isActive: boolean;
  employer: EmployerInfo;
}

export class PositionWithDetails extends ValueObject<PositionWithDetailsProps> {
  get subscriptionId() {
    return this.props.subscriptionId;
  }

  get positionId() {
    return this.props.positionId;
  }

  set positionId(positionId: UniqueEntityID) {
    this.props.positionId = positionId;
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

  get employer() {
    return this.props.employer;
  }

  set employer(employer: EmployerInfo) {
    this.props.employer = employer;
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

  static create(props: PositionWithDetailsProps) {
    return new PositionWithDetails(props);
  }
}
