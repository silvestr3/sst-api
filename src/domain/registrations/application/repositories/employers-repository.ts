import { Employer } from '../../enterprise/entities/employer';

export abstract class EmployersRepository {
  abstract create(employer: Employer): Promise<void>;
  abstract fetchByGroupId(groupId: string): Promise<Employer[]>;
}
