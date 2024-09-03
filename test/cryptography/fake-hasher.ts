import { HashComparer } from '@/domain/registrations/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/registrations/application/cryptography/hash-generator';

export class FakeHasher implements HashGenerator, HashComparer {
  async compare(plain: string, hash: string): Promise<boolean> {
    return `${plain}-hashed` === hash;
  }

  async hash(text: string): Promise<string> {
    return `${text}-hashed`;
  }
}
