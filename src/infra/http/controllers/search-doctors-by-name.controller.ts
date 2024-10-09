import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DoctorPresenter } from '../presenters/doctor-presenter';
import { FetchAllDoctorsResponse } from '../dto/fetch-all-doctors.dto';
import { SearchDoctorsByNameUseCase } from '@/domain/registrations/application/use-cases/search-doctors-by-name';

@Controller('/doctors/search')
export class SearchDoctorsByNameController {
  constructor(private searchDoctorsByName: SearchDoctorsByNameUseCase) {}

  @ApiTags('Doctors')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FetchAllDoctorsResponse,
    description: 'List of doctors',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiOperation({
    summary: 'Search doctors from subscription by name',
  })
  @Get()
  async handle(@CurrentUser() user: UserPayload, @Query('q') query: string) {
    const { sub, subscription } = user;

    const result = await this.searchDoctorsByName.execute({
      subscriptionId: subscription,
      executorId: sub,
      searchTerm: query,
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

    const { doctors } = result.value;

    const presenterDoctors = doctors.map(DoctorPresenter.toHttp);

    return { doctors: presenterDoctors };
  }
}
