import { Either, left, right } from '@/core/either';
import { AdministratorsRepository } from '../repositories/administrators-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { Injectable } from '@nestjs/common';

interface AuthenticateParams {
  email: string;
  password: string;
}

type AuthenticateResponse = Either<InvalidCredentialsError, { token: string }>;
@Injectable()
export class AuthenticateUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateParams): Promise<AuthenticateResponse> {
    const account = await this.administratorsRepository.findByEmail(email);

    if (!account) {
      return left(new InvalidCredentialsError());
    }

    const doPasswordsMatch = await this.hashComparer.compare(
      password,
      account.password,
    );

    if (!doPasswordsMatch) {
      return left(new InvalidCredentialsError());
    }

    const token = await this.encrypter.encrypt({
      sub: account.id.toString(),
      subscription: account.subscriptionId.toString(),
    });

    return right({ token });
  }
}
