import { PositionsRepository } from '@/domain/registrations/application/repositories/positions-repository';
import { Position } from '@/domain/registrations/enterprise/entities/position';

export class FakePositionsRepository implements PositionsRepository {
  public items: Position[] = [];

  async create(position: Position): Promise<void> {
    this.items.push(position);
  }

  async save(position: Position): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(position.id));

    this.items[index] = position;
  }

  async findById(id: string): Promise<Position | null> {
    const position = this.items.find((item) => item.id.toString() === id);

    return position ?? null;
  }

  async fetchByEmployerId(id: string): Promise<Position[]> {
    const positions = this.items.filter(
      (item) => item.employerId.toString() === id,
    );

    return positions;
  }
}
