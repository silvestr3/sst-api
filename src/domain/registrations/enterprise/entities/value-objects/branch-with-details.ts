import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { EmployerInfo } from './department-with-details';
import { AddressInfo } from './employer-with-details';

export interface BranchWithDetailsProps {
  subscriptionId: UniqueEntityID;
  branchId: UniqueEntityID;
  name: string;
  employer: EmployerInfo;
  address: AddressInfo;
}

export class BranchWithDetails extends ValueObject<BranchWithDetailsProps> {
  get subscriptionId() {
    return this.props.subscriptionId;
  }

  get branchId() {
    return this.props.branchId;
  }

  set branchId(branchId: UniqueEntityID) {
    this.props.branchId = branchId;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get employer() {
    return this.props.employer;
  }

  set employer(employer: EmployerInfo) {
    this.props.employer = employer;
  }

  get address() {
    return this.props.address;
  }

  set address(address: AddressInfo) {
    this.props.address = address;
  }

  static create(props: BranchWithDetailsProps) {
    return new BranchWithDetails(props);
  }
}
