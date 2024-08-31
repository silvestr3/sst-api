import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeEmployer } from 'test/factories/make-employer';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { validateResourceOwnership } from './validate-resource-ownership';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

describe('Validate resource ownership tests', () => {
  let employersRepository: FakeEmployersRepository;

  beforeEach(() => {
    employersRepository = new FakeEmployersRepository();
  });

  it('Should return left if resource is from other subscription', async () => {
    const employer = makeEmployer({
      subscriptionId: new UniqueEntityID('random-subscription'),
    });
    employersRepository.items.push(employer);

    const result = await validateResourceOwnership({
      repository: employersRepository,
      subscriptionId: new UniqueEntityID('my-subscription'),
      resourceId: employer.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('Should return left if resource is not found', async () => {
    const result = await validateResourceOwnership({
      repository: employersRepository,
      subscriptionId: new UniqueEntityID('my-subscription'),
      resourceId: 'unexisting-employer',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
