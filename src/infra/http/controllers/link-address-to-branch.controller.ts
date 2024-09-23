import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';
import { LinkAddressDTO } from '../dto/link-address.dto';
import { LinkAddressToBranchUseCase } from '@/domain/registrations/application/use-cases/link-address-to-branch';

@Controller('/branches/:branchId/address')
export class LinkAddressToBranchController {
  constructor(private linkAddressToBranch: LinkAddressToBranchUseCase) {}

  @ApiTags('Branches')
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: 'Address successfully linked to branch',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Branch or address was not found',
  })
  @ApiOperation({
    summary: 'Link address to branch',
  })
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('branchId', new IsValidUUIDPipe('branchId')) branchId: string,
    @Body() body: LinkAddressDTO,
  ) {
    const { sub, subscription } = user;
    const { addressId } = body;

    const result = await this.linkAddressToBranch.execute({
      subscriptionId: subscription,
      executorId: sub,
      branchId,
      addressId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
