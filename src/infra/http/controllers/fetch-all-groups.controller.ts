import {
  BadRequestException,
  Controller,
  Get,
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
import { FetchAllGroupsUseCase } from '@/domain/registrations/application/use-cases/fetch-all-groups';
import { FetchAllGroupsResponse } from '../dto/fetch-all-groups.dto';
import { GroupPresenter } from '../presenters/group-presenter';

@Controller('/groups')
export class FetchAllGroupsController {
  constructor(private fetchAllGroups: FetchAllGroupsUseCase) {}

  @ApiTags('Groups')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FetchAllGroupsResponse,
    description: 'List of groups',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized to perform this action',
  })
  @ApiOperation({
    summary: 'List all groups from subscription',
  })
  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub, subscription } = user;

    const result = await this.fetchAllGroups.execute({
      subscriptionId: subscription,
      executorId: sub,
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

    const { groups } = result.value;

    const presenterGroups = groups.map(GroupPresenter.toHttp);

    return { groups: presenterGroups };
  }
}
