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
import { LinkAddressToEmployerUseCase } from '@/domain/registrations/application/use-cases/link-address-to-employer';

@Controller('/employers/:employerId/address')
export class LinkAddressToEmployerController {
  constructor(private linkAddressToemployer: LinkAddressToEmployerUseCase) {}

  @ApiTags('Employers')
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: 'Address successfully linked to employer',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employer or address was not found',
  })
  @ApiOperation({
    summary: 'Link address to employer',
  })
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('employerId', new IsValidUUIDPipe('employerId')) employerId: string,
    @Body() body: LinkAddressDTO,
  ) {
    const { sub, subscription } = user;
    const { addressId } = body;

    const result = await this.linkAddressToemployer.execute({
      subscriptionId: subscription,
      executorId: sub,
      employerId,
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
