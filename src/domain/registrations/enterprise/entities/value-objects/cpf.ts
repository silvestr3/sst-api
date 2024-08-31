import { ValueObject } from '@/core/entities/value-object';

export interface CpfProps {
  value: string;
}

export class Cpf extends ValueObject<CpfProps> {
  get value() {
    return this.props.value;
  }

  private static getDigitsToValidate(value: string, first: string = undefined) {
    if (first) {
      return first + value.substring(0, 9).split('').reverse().join('');
    }
    return value.substring(0, 9).split('').reverse().join('');
  }

  private static getValidatorDigit(value: string) {
    let sum = 0;

    for (let i = 0; i < value.length; i++) {
      let partial = Number(value[i]) * (i + 2);
      sum += partial;
    }

    const module = sum % 11;

    if (module < 2) {
      return String(0);
    }

    return String(11 - module);
  }

  static validateAndCreate(value: string) {
    if (value.length !== 11) {
      return null;
    }

    const firstValidatorDigit = this.getValidatorDigit(
      this.getDigitsToValidate(value),
    );
    const secondValidatorDigit = this.getValidatorDigit(
      this.getDigitsToValidate(value, firstValidatorDigit),
    );

    const validCpf =
      value.substring(0, 9) + firstValidatorDigit + secondValidatorDigit;

    if (value !== validCpf) {
      return null;
    }

    return new Cpf({ value });
  }
}
