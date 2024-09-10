import {
  BadRequestException,
  Controller,
  Get,
  Param,
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
import { FetchEmployersByGroupIdUseCase } from '@/domain/registrations/application/use-cases/fetch-employers-by-group-id';
import { FetchEmployersByGroupIdResponse } from '../dto/fetch-employers-by-group-id.dto';
import { EmployerPresenter } from '../presenters/employer-presenter';

@Controller('/groups/:groupId/employers')
export class FetchEmployersByGroupIdController {
  constructor(
    private fetchEmployersByGroupId: FetchEmployersByGroupIdUseCase,
  ) {}

  @ApiTags('Groups')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FetchEmployersByGroupIdResponse,
    description: 'List of employers in the group',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiOperation({
    summary: 'List all employers of the group',
  })
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('groupId') groupId: string,
  ) {
    const { sub, subscription } = user;

    const result = await this.fetchEmployersByGroupId.execute({
      subscriptionId: subscription,
      executorId: sub,
      groupId,
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

    const { employers } = result.value;

    const presenterEmployers = employers.map(EmployerPresenter.toHttp);

    return { employers: presenterEmployers };
  }
}
