import { PositionDetailsDTO } from '../dto/get-position-details.dto';
import { PositionWithDetails } from '@/domain/registrations/enterprise/entities/value-objects/position-with-details';

export class PositionDetailsPresenter {
  static toHttp(position: PositionWithDetails): PositionDetailsDTO {
    return {
      id: position.positionId.toString(),
      name: position.name,
      description: position.description,
      cbo: position.cbo,
      isActive: position.isActive,
      employer: {
        employerId: position.employer.employerId.toString(),
        nomeFantasia: position.employer.nomeFantasia,
        razaoSocial: position.employer.razaoSocial,
      },
    };
  }
}
