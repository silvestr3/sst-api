import { PositionsRepository } from '@/domain/registrations/application/repositories/positions-repository';
import { Position } from '@/domain/registrations/enterprise/entities/position';
import { PositionWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/position-with-details';
import { FakeEmployersRepository } from './fake-employers-repository';

export class FakePositionsRepository implements PositionsRepository {
  constructor(private employersRepository: FakeEmployersRepository) {}
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

  async findByIdWithDetails(id: string): Promise<PositionWithDetails | null> {
    const position = this.items.find((item) => item.id.toString() === id);

    if (!position) return null;

    const employer = this.employersRepository.items.find((item) =>
      item.id.equals(position.employerId),
    );

    return PositionWithDetails.create({
      subscriptionId: position.subscriptionId,
      positionId: position.id,
      name: position.name,
      description: position.description,
      cbo: position.cbo,
      isActive: position.isActive,
      employer: {
        employerId: employer.id,
        nomeFantasia: employer.nomeFantasia,
        razaoSocial: employer.nomeFantasia,
      },
    });
  }

  async fetchByEmployerId(id: string): Promise<Position[]> {
    const positions = this.items.filter(
      (item) => item.employerId.toString() === id,
    );

    return positions;
  }

  async searchByName(
    subscriptionId: string,
    employerId: string,
    searchTerm: string,
  ): Promise<Position[]> {
    const positions = this.items.filter(
      (item) =>
        item.subscriptionId.toString() === subscriptionId &&
        item.employerId.toString() === employerId &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return positions;
  }
}
