import { Doctor } from '@/domain/registrations/enterprise/entities/doctor';
import { DoctorObject } from '../dto/create-doctor.dto';

export class DoctorPresenter {
  static toHttp(doctor: Doctor): DoctorObject {
    return {
      id: doctor.id.toString(),
      name: doctor.name,
      crm: doctor.crm,
      ufCrm: doctor.ufCrm,
      phone: doctor.phone,
    };
  }
}
