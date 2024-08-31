import { Cpf } from './cpf';

describe('CPF value object tests', () => {
  it('Should return Cpf instance to valid CPF', () => {
    const cpf = '60511982020';

    const isValid = Cpf.validateAndCreate(cpf);

    expect(isValid).toBeInstanceOf(Cpf);
  });

  it('Should return null to invalid CPF number', () => {
    const cpf = '123';

    const isValid = Cpf.validateAndCreate(cpf);

    expect(isValid).toBeNull();
  });

  it('Should return null to invalid CPF lenght', () => {
    const cpf = '12387635651';

    const isValid = Cpf.validateAndCreate(cpf);

    expect(isValid).toBeNull();
  });
});
