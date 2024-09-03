import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { CreateAddressUseCase } from '../create-address';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { CreateAdministratorAccountUseCase } from '../create-administrator-account';
import { FakeAdministratorsRepository } from 'test/repositories/fake-administrators-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { Cpf } from '@/domain/registrations/enterprise/entities/value-objects/cpf';

describe('Create administrator account tests', () => {
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let administratorsRepository: FakeAdministratorsRepository;
  let hashGenerator: FakeHasher;
  let sut: CreateAdministratorAccountUseCase;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();
    administratorsRepository = new FakeAdministratorsRepository();
    hashGenerator = new FakeHasher();

    sut = new CreateAdministratorAccountUseCase(
      subscriptionsRepository,
      administratorsRepository,
      hashGenerator,
    );
  });

  it('Should be able to create a new administrator account', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '23016215020',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const subscription = subscriptionsRepository.items[0];
    const administrator = administratorsRepository.items[0];

    expect(result.isRight()).toBeTruthy();
    expect(administratorsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        password: await hashGenerator.hash('123456'),
        cpf: Cpf.validateAndCreate('23016215020'),
        subscriptionId: subscription.id,
      }),
    );
    expect(subscription.administratorId).toEqual(administrator.id);
  });
});
