export class InvalidInformationError extends Error {
  constructor(data: string) {
    super(`Provided ${data} is not valid`);
  }
}
