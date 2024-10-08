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
import { GroupPresenter } from '../presenters/group-presenter';
import { SearchGroupsByNameUseCase } from '@/domain/registrations/application/use-cases/search-group-by-name';
import { FetchAllGroupsResponse } from '../dto/fetch-all-groups.dto';

@Controller('/groups/search')
export class SearchGroupsByNameController {
  constructor(private searchGroupsByName: SearchGroupsByNameUseCase) {}

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
    summary: 'Search groups from subscription by name',
  })
  @Get()
  async handle(@CurrentUser() user: UserPayload, @Query('q') query: string) {
    const { sub, subscription } = user;

    const result = await this.searchGroupsByName.execute({
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

    const { groups } = result.value;

    const presenterGroups = groups.map(GroupPresenter.toHttp);

    return { groups: presenterGroups };
  }
}
