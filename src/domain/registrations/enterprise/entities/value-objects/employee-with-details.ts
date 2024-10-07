import { ValueObject } from '@/core/entities/value-object';
import { EmployerInfo } from './department-with-details';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Cpf } from './cpf';

export interface BranchInfo {
  branchId: UniqueEntityID;
  name: string;
}

export interface DepartmentInfo {
  departmentId: UniqueEntityID;
  name: string;
  description: string;
}

export interface PositionInfo {
  positionId: UniqueEntityID;
  name: string;
  description: string;
  cbo: string;
}

export interface EmployeeWithDetailsProps {
  subscriptionId: UniqueEntityID;
  employeeId: UniqueEntityID;
  employer: EmployerInfo;
  branch: BranchInfo;
  department: DepartmentInfo;
  position: PositionInfo;
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

export class EmployeeWithDetails extends ValueObject<EmployeeWithDetailsProps> {
  get subscriptionId() {
    return this.props.subscriptionId;
  }

  get employeeId() {
    return this.props.employeeId;
  }

  set employeeId(employeeId: UniqueEntityID) {
    this.props.employeeId = employeeId;
  }

  get employer() {
    return this.props.employer;
  }

  set employer(employer: EmployerInfo) {
    this.props.employer = employer;
  }

  get branch() {
    return this.props.branch;
  }

  set branch(branch: BranchInfo) {
    this.props.branch = branch;
  }

  get department() {
    return this.props.department;
  }

  set department(department: DepartmentInfo) {
    this.props.department = department;
  }

  get position() {
    return this.props.position;
  }

  set position(position: PositionInfo) {
    this.props.position = position;
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

  static create(props: EmployeeWithDetailsProps) {
    return new EmployeeWithDetails(props);
  }
}
