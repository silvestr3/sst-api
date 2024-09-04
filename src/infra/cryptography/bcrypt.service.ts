import { HashComparer } from '@/domain/registrations/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/registrations/application/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class BcryptService implements HashGenerator, HashComparer {
  async hash(text: string): Promise<string> {
    const ROUNDS = 8;

    return await hash(text, ROUNDS);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash);
  }
}
