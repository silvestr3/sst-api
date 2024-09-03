import { Either, left, right } from '@/core/either';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository';
import { Administrator } from '../../enterprise/entities/administrator';
import { AdministratorsRepository } from '../repositories/administrators-repository';
import { AccountAlreadyExistsError } from './errors/account-already-exists-error';
import { Cpf } from '../../enterprise/entities/value-objects/cpf';
import { InvalidInformationError } from './errors/invalid-information-error';
import { HashGenerator } from '../cryptography/hash-generator';
import { Subscription } from '../../enterprise/entities/subscription';
import { Injectable } from '@nestjs/common';

interface CreateAdministratorAccountParams {
  email: string;
  password: string;
  name: string;
  cpf: string;
  phone?: string;
}

type CreateAdministratorAccountResponse = Either<
  AccountAlreadyExistsError | InvalidInformationError,
  { administrator: Administrator }
>;

@Injectable()
export class CreateAdministratorAccountUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private administratorsRepository: AdministratorsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    password,
    name,
    cpf,
    phone,
  }: CreateAdministratorAccountParams): Promise<CreateAdministratorAccountResponse> {
    const doesAccountExist =
      await this.administratorsRepository.findByEmail(email);

    if (doesAccountExist) {
      return left(new AccountAlreadyExistsError());
    }

    const validatedCPF = Cpf.validateAndCreate(cpf);
    if (!validatedCPF) {
      return left(new InvalidInformationError('CPF'));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const administrator = Administrator.create({
      name,
      email,
      password: hashedPassword,
      cpf: validatedCPF,
      phone,
    });

    const subscription = Subscription.create({
      administratorId: administrator.id,
    });

    administrator.subscriptionId = subscription.id;

    await this.administratorsRepository.create(administrator);
    await this.subscriptionsRepository.create(subscription);

    return right({ administrator });
  }
}
