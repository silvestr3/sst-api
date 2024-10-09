import { Repository } from '@/core/repositories/repository';
import { Position } from '../../enterprise/entities/position';
import { PositionWithDetails } from '../../enterprise/entities/value-objects/position-with-details';

export abstract class PositionsRepository extends Repository<Position> {
  abstract create(position: Position): Promise<void>;
  abstract save(position: Position): Promise<void>;
  abstract findById(id: string): Promise<Position | null>;
  abstract findByIdWithDetails(id: string): Promise<PositionWithDetails | null>;
  abstract fetchByEmployerId(id: string): Promise<Position[]>;
  abstract searchByName(
    subscriptionId: string,
    employerId: string,
    searchTerm: string,
  ): Promise<Position[]>;
}
