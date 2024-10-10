export class InvalidInformationError extends Error {
  constructor(data: string) {
    super(`${data} fornecido é inválido`);
  }
}
