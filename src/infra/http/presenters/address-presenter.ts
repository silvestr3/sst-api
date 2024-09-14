import { Address } from '@/domain/registrations/enterprise/entities/address';
import { AddressObjectDTO } from '../dto/create-address.dto';

export class AddressPresenter {
  static toHttp(address: Address): AddressObjectDTO {
    return {
      id: address.id.toString(),
      cep: address.cep,
      city: address.city,
      district: address.district,
      state: address.state,
      street: address.street,
      complement: address.complement ?? undefined,
      number: address.number ?? undefined,
    };
  }
}
