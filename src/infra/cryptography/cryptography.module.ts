import { Module } from '@nestjs/common';
import { JwtEncrypter } from './jwt-encrypter.service';
import { BcryptService } from './bcrypt.service';
import { Encrypter } from '@/domain/registrations/application/cryptography/encrypter';
import { HashGenerator } from '@/domain/registrations/application/cryptography/hash-generator';
import { HashComparer } from '@/domain/registrations/application/cryptography/hash-comparer';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashGenerator,
      useClass: BcryptService,
    },
    {
      provide: HashComparer,
      useClass: BcryptService,
    },
  ],
  exports: [Encrypter, HashGenerator, HashComparer],
})
export class CryptographyModule {}
