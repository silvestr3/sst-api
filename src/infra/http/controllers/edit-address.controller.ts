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
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EditAddressUseCase } from '@/domain/registrations/application/use-cases/edit-address';
import { EditAddressDTO } from '../dto/edit-address.dto';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';

@Controller('/addresses/:addressId')
export class EditAddressController {
  constructor(private editAddress: EditAddressUseCase) {}

  @ApiTags('Addresses')
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'User is not allowed to perform this action',
  })
  @ApiOperation({
    summary: 'Edit an address',
  })
  @ApiBearerAuth()
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('addressId', new IsValidUUIDPipe('addressId')) addressId: string,
    @Body() body: EditAddressDTO,
  ) {
    const { cep, city, complement, district, state, street, number } = body;
    const { sub, subscription } = user;

    const result = await this.editAddress.execute({
      subscriptionId: subscription,
      executorId: sub,
      addressId,
      cep,
      street,
      complement,
      number,
      district,
      city,
      state,
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
