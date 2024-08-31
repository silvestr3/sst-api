import { Repository } from '@/core/repositories/repository';
import { Address } from '../../enterprise/entities/address';

export abstract class AddressesRepository extends Repository<Address> {
  abstract create(address: Address): Promise<void>;
  abstract save(address: Address): Promise<void>;
  abstract findById(id: string): Promise<Address | null>;
}
