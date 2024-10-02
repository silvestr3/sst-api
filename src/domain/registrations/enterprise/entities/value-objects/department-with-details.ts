import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface EmployerInfo {
  employerId: UniqueEntityID;
  razaoSocial: string;
  nomeFantasia: string;
}

export interface DepartmentWithDetailsProps {
  subscriptionId: UniqueEntityID;
  departmentId: UniqueEntityID;
  employer: EmployerInfo;
  name: string;
  description: string;
}

export class DepartmentWithDetails extends ValueObject<DepartmentWithDetailsProps> {
  get subscriptionId() {
    return this.props.subscriptionId;
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

  static create(props: DepartmentWithDetailsProps) {
    return new DepartmentWithDetails(props);
  }
}
