import { FakePositionsRepository } from 'test/repositories/fake-positions-repository';
import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { makePosition } from 'test/factories/make-position';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';
import { SearchPositionsByNameUseCase } from '../search-positions-by-name';

describe('Search position by name tests', () => {
  let employersRepository: FakeEmployersRepository;
  let subscriptionsRepository: FakeSubscriptionsRepository;
  let addressesRepository: FakeAddressesRepository;
  let doctorsRepository: FakeDoctorsRepository;
  let positionsRepository: FakePositionsRepository;

  let sut: SearchPositionsByNameUseCase;

  beforeEach(() => {
    employersRepository = new FakeEmployersRepository(
      addressesRepository,
      doctorsRepository,
    );
    subscriptionsRepository = new FakeSubscriptionsRepository();
    positionsRepository = new FakePositionsRepository(employersRepository);

    sut = new SearchPositionsByNameUseCase(
      subscriptionsRepository,
      positionsRepository,
      employersRepository,
    );
  });

  it('Should be able to search positions by position name and employer id', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    for (let i = 0; i < 20; i++) {
      const position = makePosition({
        subscriptionId: subscription.id,
        name: i < 10 ? 'Return ' : 'Other',
        employerId: employer.id,
      });

      positionsRepository.items.push(position);
    }

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      employerId: employer.id.toString(),
      searchTerm: 'retur',
    });

    // @ts-ignore
    const { positions } = result.value;

    expect(result.isRight()).toBeTruthy();
    expect(positions).toHaveLength(10);
  });
});
