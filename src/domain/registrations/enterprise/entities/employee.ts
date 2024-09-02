import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Cpf } from './value-objects/cpf';

export interface EmployeeProps {
  subscriptionId: UniqueEntityID;
  groupId: UniqueEntityID;
  employerId: UniqueEntityID;
  branchId: UniqueEntityID;
  departmentId: UniqueEntityID;
  positionId: UniqueEntityID;
  name: string;
  cpf: Cpf;
  admissionDate: Date;
  birthDate: Date;
  hasEmploymentRelationship: boolean;
  registration?: string;
  lastClinicalEvaluation?: Date | null;
  gender: 'MALE' | 'FEMALE';
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'VACATIONS' | 'REMOVED';
}

export class Employee extends Entity<EmployeeProps> {
  get subscriptionId() {
    return this.props.subscriptionId;
  }

  get employerId() {
    return this.props.employerId;
  }

  set employerId(employerId: UniqueEntityID) {
    this.props.employerId = employerId;
  }

  get groupId() {
    return this.props.groupId;
  }

  set groupId(groupId: UniqueEntityID) {
    this.props.groupId = groupId;
  }

  get branchId() {
    return this.props.branchId;
  }

  set branchId(branchId: UniqueEntityID) {
    this.props.branchId = branchId;
  }

  get departmentId() {
    return this.props.departmentId;
  }

  set departmentId(departmentId: UniqueEntityID) {
    this.props.departmentId = departmentId;
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

  get cpf() {
    return this.props.cpf;
  }

  set cpf(cpf: Cpf) {
    this.props.cpf = cpf;
  }

  get admissionDate() {
    return this.props.admissionDate;
  }

  set admissionDate(admissionDate: Date) {
    this.props.admissionDate = admissionDate;
  }

  get birthDate() {
    return this.props.birthDate;
  }

  set birthDate(birthDate: Date) {
    this.props.birthDate = birthDate;
  }

  get hasEmploymentRelationship() {
    return this.props.hasEmploymentRelationship;
  }

  set hasEmploymentRelationship(hasEmploymentRelationship: boolean) {
    this.props.hasEmploymentRelationship = hasEmploymentRelationship;
  }

  get registration() {
    return this.props.registration;
  }

  set registration(registration: string) {
    this.props.registration = registration;
  }

  get lastClinicalEvaluation() {
    return this.props.lastClinicalEvaluation;
  }

  set lastClinicalEvaluation(lastClinicalEvaluation: Date) {
    this.props.lastClinicalEvaluation = lastClinicalEvaluation;
  }

  get gender() {
    return this.props.gender;
  }

  set gender(gender: 'MALE' | 'FEMALE') {
    this.props.gender = gender;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get status() {
    return this.props.status;
  }

  set status(status: 'ACTIVE' | 'INACTIVE' | 'VACATIONS' | 'REMOVED') {
    this.props.status = status;
  }

  static create(props: EmployeeProps, id?: UniqueEntityID) {
    return new Employee(props, id);
  }
}
