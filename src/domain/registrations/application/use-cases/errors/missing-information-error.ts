export class MissingInformationError extends Error {
  constructor(field: string) {
    super(`Missing ${field} to create employer`);
  }
}
