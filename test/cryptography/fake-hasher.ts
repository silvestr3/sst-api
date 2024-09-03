import { HashGenerator } from '@/domain/registrations/application/cryptography/hash-generator';

export class FakeHasher implements HashGenerator {
  async hash(text: string): Promise<string> {
    return `${text}-hashed`;
  }
}
