import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Repository } from '@/core/repositories/repository';

interface ValidateResourceOwnershipParams<T> {
  repository: Repository<T>;
  subscriptionId: UniqueEntityID;
  resourceId: string;
}

type ValidateResourceOwnershipResponse<T> = Either<
  ResourceNotFoundError | NotAllowedError,
  T
>;

interface EntityWithSubscriptionId {
  subscriptionId: UniqueEntityID;
}

export async function validateResourceOwnership<
  T extends EntityWithSubscriptionId,
>({
  repository,
  subscriptionId,
  resourceId,
}: ValidateResourceOwnershipParams<T>): Promise<
  ValidateResourceOwnershipResponse<T>
> {
  const entity: EntityWithSubscriptionId =
    await repository.findById(resourceId);

  if (!entity) {
    return left(new ResourceNotFoundError());
  }

  if (!entity.subscriptionId.equals(subscriptionId)) {
    return left(new NotAllowedError());
  }

  return right(entity as T);
}
