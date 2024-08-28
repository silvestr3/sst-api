import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface GroupProps {
  subscriptionId: UniqueEntityID;
  name: string;
  description: string;
  logoUrl: string;
  isActive: boolean;
}

export class Group extends Entity<GroupProps> {
  get subscriptionId() {
    return this.props.subscriptionId;
  }

  set subscriptionId(subscriptionId: UniqueEntityID) {
    this.props.subscriptionId = subscriptionId;
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

  get logoUrl() {
    return this.props.logoUrl;
  }

  set logoUrl(logoUrl: string) {
    this.props.logoUrl = logoUrl;
  }

  get isActive() {
    return this.props.isActive;
  }

  set isActive(isActive: boolean) {
    this.props.isActive = isActive;
  }

  static create(props: GroupProps, id?: UniqueEntityID) {
    return new Group(props, id);
  }
}
