import { AddressesRepository } from '@/domain/registrations/application/repositories/addresses-repository';
import { Address } from '@/domain/registrations/enterprise/entities/address';

export class FakeAddressesRepository implements AddressesRepository {
  public items: Address[] = [];

  async create(address: Address): Promise<void> {
    this.items.push(address);
  }

  async save(address: Address): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(address.id));

    this.items[index] = address;
  }

  async findById(id: string): Promise<Address | null> {
    const address = this.items.find((item) => item.id.toString() === id);

    return address ?? null;
  }
}
