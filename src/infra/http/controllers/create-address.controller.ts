import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateAddressUseCase } from '@/domain/registrations/application/use-cases/create-address';
import { AddressObjectDTO, CreateAddressDTO } from '../dto/create-address.dto';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { AddressPresenter } from '../presenters/address-presenter';

@Controller('/addresses')
export class CreateAddressController {
  constructor(private createAddress: CreateAddressUseCase) {}

  @ApiTags('Addresses')
  @ApiCreatedResponse({
    type: AddressObjectDTO,
    description: 'New Address',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not allowed to perform this action',
  })
  @ApiOperation({
    summary: 'Create new address',
  })
  @ApiBearerAuth()
  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateAddressDTO,
  ) {
    const { cep, city, complement, district, state, street, number } = body;
    const { sub, subscription } = user;

    const result = await this.createAddress.execute({
      subscriptionId: subscription,
      executorId: sub,
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
        default:
          throw new BadRequestException();
      }
    }

    const { address } = result.value;

    return { address: AddressPresenter.toHttp(address) };
  }
}
