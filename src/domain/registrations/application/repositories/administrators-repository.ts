import { Repository } from '@/core/repositories/repository';
import { Administrator } from '../../enterprise/entities/administrator';

export abstract class AdministratorsRepository extends Repository<Administrator> {
  abstract findById(id: string): Promise<Administrator | null>;
  abstract findByEmail(email: string): Promise<Administrator | null>;
  abstract create(administrator: Administrator): Promise<void>;
  abstract save(administrator: Administrator): Promise<void>;
}
