import { ApiProperty } from '@nestjs/swagger';
import { eSocialEnrollmentTypeValues } from './fetch-employers-by-group-id.dto';

export class DoctorInfoDTO {
  @ApiProperty()
  doctorId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;
}

export class AddressInfoDTO {
  @ApiProperty()
  addressId: string;

  @ApiProperty()
  cep: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  complement?: string;

  @ApiProperty()
  number?: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;
}

export class EmployerDetailsDTO {
  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: eSocialEnrollmentTypeValues,
    example: eSocialEnrollmentTypeValues.CPF,
  })
  eSocialEnrollmentType: 'CPF' | 'CNPJ';

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  cnpj: string;

  @ApiProperty()
  razaoSocial: string;

  @ApiProperty()
  nomeFantasia: string;

  @ApiProperty()
  cnae: string;

  @ApiProperty()
  activity: string;

  @ApiProperty()
  riskLevel: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: DoctorInfoDTO })
  responsibleDoctor: DoctorInfoDTO;

  @ApiProperty({ type: AddressInfoDTO })
  address: AddressInfoDTO;
}

export class GetEmployerDetailsResponse {
  @ApiProperty({ type: EmployerDetailsDTO })
  employer: EmployerDetailsDTO;
}
