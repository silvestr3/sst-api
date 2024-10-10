export class MissingInformationError extends Error {
  constructor(field: string) {
    super(`Campo ${field} não informado`);
  }
}
