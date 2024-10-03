import { FakeSubscriptionsRepository } from 'test/repositories/fake-subscriptions-repository';
import { makeSubscription } from 'test/factories/make-subscription';
import { FakePositionsRepository } from 'test/repositories/fake-positions-repository';
import { makePosition } from 'test/factories/make-position';
import { FakeAddressesRepository } from 'test/repositories/fake-addresses-repository';
import { FakeDoctorsRepository } from 'test/repositories/fake-doctors-repository';
import { GetPositionDetailsUseCase } from '../get-position-details';
import { FakeEmployersRepository } from 'test/repositories/fake-employers-repository';
import { makeEmployer } from 'test/factories/make-employer';

describe('get position details tests', () => {
  let sut: GetPositionDetailsUseCase;

  let subscriptionsRepository: FakeSubscriptionsRepository;

  let addressesRepository: FakeAddressesRepository;
  let doctorsRepository: FakeDoctorsRepository;

  let positionsRepository: FakePositionsRepository;
  let employersRepository: FakeEmployersRepository;

  beforeEach(() => {
    subscriptionsRepository = new FakeSubscriptionsRepository();

    addressesRepository = new FakeAddressesRepository();
    doctorsRepository = new FakeDoctorsRepository();

    employersRepository = new FakeEmployersRepository(
      addressesRepository,
      doctorsRepository,
    );

    positionsRepository = new FakePositionsRepository(employersRepository);

    sut = new GetPositionDetailsUseCase(
      subscriptionsRepository,
      positionsRepository,
    );
  });

  it('Should be able to find one position with details', async () => {
    const subscription = makeSubscription();
    subscriptionsRepository.items.push(subscription);

    const employer = makeEmployer({
      subscriptionId: subscription.id,
    });
    employersRepository.items.push(employer);

    const position = makePosition({
      subscriptionId: subscription.id,
      employerId: employer.id,
    });
    positionsRepository.items.push(position);

    const result = await sut.execute({
      subscriptionId: subscription.id.toString(),
      executorId: subscription.administratorId.toString(),
      positionId: position.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();

    expect(result.value).toEqual(
      expect.objectContaining({
        position: expect.objectContaining({
          props: expect.objectContaining({
            positionId: position.id,
            employer: expect.objectContaining({
              employerId: employer.id,
            }),
          }),
        }),
      }),
    );
  });
});
