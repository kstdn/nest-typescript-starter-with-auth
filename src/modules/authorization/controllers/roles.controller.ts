import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Body,
} from '@nestjs/common';
import { FilterQuery } from 'src/common/decorators/filter-query.decorator';
import { OrderQuery } from 'src/common/decorators/order-query.decorator';
import { PaginationQuery } from 'src/common/decorators/pagination-query.decorator';
import { FilteringOptions } from 'src/common/util/filtering';
import { OrderingOptions } from 'src/common/util/ordering';
import { Paginated, PaginationOptions } from 'src/common/util/pagination';
import { Routes } from '../../../routes';
import { Authorize } from '../decorators/authorize.decorator';
import { Role } from '../entities/role.entity';
import {
  CreateAny,
  DeleteAny,
  ReadAny,
  UpdateAny,
} from '../resources/operations';
import { Resource } from '../resources/resource';
import { RolesService } from '../services/roles.service';

@Controller(`${Routes.Authorization.Root}/${Routes.Authorization.Roles.Root}`)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Authorize(ReadAny(Resource.Role))
  @Get()
  async getAll(
    @PaginationQuery() paginationOptions: PaginationOptions,
    @FilterQuery('name') filteringOptions: FilteringOptions,
    @OrderQuery() orderingOptions: OrderingOptions,
  ): Promise<Paginated<Role>> {
    return this.rolesService.findAllPaginated(
      paginationOptions,
      filteringOptions,
      orderingOptions,
    );
  }

  @Authorize(ReadAny(Resource.Role))
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<Role> {
    return this.rolesService.findOneOrThrow(id);
  }

  @Authorize(CreateAny(Resource.Role))
  @Post()
  async createRole(@Body('name') name: string): Promise<Role> {
    return this.rolesService.create(name);
  }

  @Authorize(UpdateAny(Resource.Role))
  @Post(`:roleId/${Routes.Authorization.Roles.User}/:userId`)
  async assignRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Role> {
    return this.rolesService.assign(roleId, userId);
  }

  @Authorize(UpdateAny(Resource.Role))
  @Delete(`:roleId/${Routes.Authorization.Roles.User}/:userId`)
  async unassignRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Role> {
    return this.rolesService.unassign(roleId, userId);
  }

  @Authorize(UpdateAny(Resource.Role))
  @Patch(':id')
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('name') name: string,
  ): Promise<Role> {
    return this.rolesService.update(id, name);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Authorize(DeleteAny(Resource.Role))
  @Delete(':id')
  async deleteRole(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.rolesService.delete(id);
  }
}
