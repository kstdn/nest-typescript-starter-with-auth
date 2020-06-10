import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { FilterQuery } from 'src/common/decorators/filter-query.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { OrderQuery } from 'src/common/decorators/order-query.decorator';
import { PaginationQuery } from 'src/common/decorators/pagination-query.decorator';
import { FilteringOptions } from 'src/common/util/filtering';
import { OrderingOptions } from 'src/common/util/ordering';
import { Paginated, PaginationOptions } from 'src/common/util/pagination';
import { Authorize } from 'src/modules/authorization/decorators/authorize.decorator';
import {
  DeleteAny,
  ReadAny,
  ReadOwn,
} from 'src/modules/authorization/resources/operations';
import { Routes } from '../../routes';
import { Resource } from '../authorization/resources/resource';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller(Routes.Users.Root)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Authorize(ReadAny(Resource.User))
  @Get()
  getAll(
    @PaginationQuery() paginationOptions: PaginationOptions,
    @FilterQuery('username') filteringOptions: FilteringOptions,
    @OrderQuery() orderingOptions: OrderingOptions,
  ): Promise<Paginated<User>> {
    return this.usersService.findAllPaginated(
      paginationOptions,
      filteringOptions,
      orderingOptions,
    );
  }

  @Authorize(ReadAny(Resource.User))
  @Get(`${Routes.Authorization.Roles.Root}/:roleId`)
  getAllWithRole(
    @Param('roleId') roleId: string,
    @PaginationQuery() paginationOptions: PaginationOptions,
    @OrderQuery() orderingOptions: OrderingOptions,
  ): Promise<Paginated<User>> {
    return this.usersService.findAllWithRolePaginated(
      roleId,
      paginationOptions,
      orderingOptions,
    );
  }

  @Authorize(ReadOwn(Resource.User))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(Routes.Users.Me)
  async getOwnProfile(@GetUser() user: User): Promise<User> {
    return user;
  }

  @Authorize(ReadAny(Resource.User))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findOneOrThrow(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Authorize(DeleteAny(Resource.User))
  @Delete()
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usersService.delete(id);
  }
}
