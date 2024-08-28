import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface SubscriptionProps {
  administratorId: UniqueEntityID;
}

export class Subscription extends Entity<SubscriptionProps> {
  get administratorId() {
    return this.props.administratorId;
  }

  set administratorId(id: UniqueEntityID) {
    this.props.administratorId = id;
  }

  static create(props: SubscriptionProps, id?: UniqueEntityID) {
    return new Subscription(props, id);
  }
}
