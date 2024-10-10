export class AccountAlreadyExistsError extends Error {
  constructor() {
    super('Conta com este e-mail já existe');
  }
}
