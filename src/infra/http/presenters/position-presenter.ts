import { Position } from '@/domain/registrations/enterprise/entities/position';
import { PositionObject } from '../dto/create-position.dto';

export class PositionPresenter {
  static toHttp(position: Position): PositionObject {
    return {
      id: position.id.toString(),
      name: position.name,
      description: position.description,
      cbo: position.cbo,
      isActive: position.isActive,
    };
  }
}
