import {
  BadRequestException,
  Controller,
  Delete,
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
import { InactivateEmployerUseCase } from '@/domain/registrations/application/use-cases/inactivate-employer';
import { IsValidUUIDPipe } from '../pipes/is-valid-uuid.pipe';

@Controller('/employers/:employerId/inactivate')
export class InactivateEmployerController {
  constructor(private inactivateEmployerUseCase: InactivateEmployerUseCase) {}

  @ApiTags('Employers')
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Employer successfully inactivated' })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiNotFoundResponse({
    description: 'Employer was not found',
  })
  @ApiOperation({
    summary: 'Inactivate an employer',
  })
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('employerId', new IsValidUUIDPipe('employerId')) employerId: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.inactivateEmployerUseCase.execute({
      subscriptionId: subscription,
      executorId: sub,
      employerId,
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
