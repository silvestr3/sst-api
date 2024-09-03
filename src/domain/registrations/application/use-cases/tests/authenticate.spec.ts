import { CreateAdministratorAccountUseCase } from '../create-administrator-account';
import { FakeAdministratorsRepository } from 'test/repositories/fake-administrators-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { Cpf } from '@/domain/registrations/enterprise/entities/value-objects/cpf';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { AuthenticateUseCase } from '../authenticate';
import { makeAdministrator } from 'test/factories/make-administrator';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';

describe('Authenticate tests', () => {
  let administratorsRepository: FakeAdministratorsRepository;
  let hashComparer: FakeHasher;
  let encrypter: FakeEncrypter;
  let sut: AuthenticateUseCase;

  beforeEach(() => {
    administratorsRepository = new FakeAdministratorsRepository();
    hashComparer = new FakeHasher();
    encrypter = new FakeEncrypter();

    sut = new AuthenticateUseCase(
      administratorsRepository,
      hashComparer,
      encrypter,
    );
  });

  it('Should be able to authenticate as an administrator', async () => {
    const administrator = makeAdministrator({
      email: 'johndoe@email.com',
      password: await hashComparer.hash('123456'),
    });
    administratorsRepository.items.push(administrator);

    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      token: expect.any(String),
    });
  });

  it('Should not be able to authenticate with incorrect credentials', async () => {
    const administrator = makeAdministrator({
      email: 'johndoe@email.com',
      password: await hashComparer.hash('123456'),
    });
    administratorsRepository.items.push(administrator);

    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: '654321',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
