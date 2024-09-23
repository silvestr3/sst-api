import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Branch,
  BranchProps,
} from '@/domain/registrations/enterprise/entities/branch';
import { PrismaBranchMapper } from '@/infra/database/prisma/mappers/prisma-branch-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export function makeBranch(
  override: Partial<BranchProps> = {},
  id?: UniqueEntityID,
) {
  const branch = Branch.create(
    {
      subscriptionId: new UniqueEntityID(randomUUID()),
      employerId: new UniqueEntityID(randomUUID()),
      name: faker.company.name(),
      ...override,
    },
    id,
  );

  return branch;
}

@Injectable()
export class BranchFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaBranch(data: Partial<BranchProps> = {}) {
    const branch = makeBranch({
      ...data,
    });

    const dataBranch = PrismaBranchMapper.toPrisma(branch);
    await this.prisma.branch.create({
      data: dataBranch,
    });

    return { branch };
  }
}
