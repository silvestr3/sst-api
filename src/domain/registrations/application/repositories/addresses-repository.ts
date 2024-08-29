import { Address } from '../../enterprise/entities/address';

export abstract class AddressesRepository {
  abstract create(address: Address): Promise<void>;
  abstract save(address: Address): Promise<void>;
}
