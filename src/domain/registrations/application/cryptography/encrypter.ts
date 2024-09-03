export abstract class Encrypter {
  abstract encrypt(payload: Record<string, any>): Promise<string>;
}
