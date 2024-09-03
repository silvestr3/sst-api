export class AccountAlreadyExistsError extends Error {
  constructor() {
    super('Account with given email already exists');
  }
}
