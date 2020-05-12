import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FilterQuery } from '../../../common/decorators/filter-query.decorator';
import { OrderQuery } from '../../../common/decorators/order-query.decorator';
import { PaginationQuery } from '../../../common/decorators/pagination-query.decorator';
import { ClassSerializerPaginatedInterceptor } from '../../../common/interceptors/class-serializer-paginated.interceptor';
import { FilteringOptions } from '../../../common/util/filtering';
import { OrderingOptions } from '../../../common/util/ordering';
import { Paginated, PaginationOptions } from '../../../common/util/pagination';
import { Routes } from '../../../routes';
import { Authorize } from '../decorators/authorize.decorator';
import { GrantPermissionDto } from '../dto/grant-permission.dto';
import { ResourcePermission } from '../entities/resource-permission.entity';
import { ParseBoolInObjectPipe } from '../pipes/parse.bool.in.object.pipe';
import {
  CreateAny,
  DeleteAny,
  ReadAny,
  UpdateAny,
} from '../resources/operations';
import { Resource } from '../resources/resource';
import { PermissionsService } from '../services/permissions.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller(
  `${Routes.Authorization.Root}/${Routes.Authorization.Permissions.Root}`,
)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Authorize(ReadAny(Resource.Permission))
  @UseInterceptors(ClassSerializerPaginatedInterceptor)
  @Get()
  getAll(
    @PaginationQuery() paginationOptions: PaginationOptions,
    @FilterQuery('resource.id', 'user.id') filteringOptions: FilteringOptions,
    @OrderQuery() orderingOptions: OrderingOptions,
  ): Promise<Paginated<ResourcePermission>> {
    return this.permissionsService.findAllPaginated(
      paginationOptions,
      filteringOptions,
      orderingOptions,
    );
  }

  @Authorize(ReadAny(Resource.Permission))
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string): Promise<ResourcePermission> {
    return this.permissionsService.findOneOrThrow(id);
  }

  @Authorize(CreateAny(Resource.Permission))
  @Post(`${Routes.Authorization.Permissions.User}`)
  async grantToUser(
    @Query('resourceId', ParseUUIDPipe) resourceId: string,
    @Query('userId', ParseUUIDPipe) userId: string,
    @Body(ParseBoolInObjectPipe) operations: GrantPermissionDto,
  ): Promise<ResourcePermission> {
    return this.permissionsService.grantToUser(resourceId, userId, operations);
  }

  @Authorize(CreateAny(Resource.Permission))
  @Post(`${Routes.Authorization.Permissions.Role}`)
  async grantToRole(
    @Query('resourceId', ParseUUIDPipe) resourceId: string,
    @Query('roleId', ParseUUIDPipe) roleId: string,
    @Body(ParseBoolInObjectPipe) operations: GrantPermissionDto,
  ): Promise<ResourcePermission> {
    return this.permissionsService.grantToRole(resourceId, roleId, operations);
  }

  @Authorize(UpdateAny(Resource.Permission))
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) permissionId: string,
    @Body(ParseBoolInObjectPipe) operations: GrantPermissionDto,
  ): Promise<ResourcePermission> {
    return this.permissionsService.update(permissionId, operations);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Authorize(DeleteAny(Resource.Permission))
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) permissionId: string,
  ): Promise<void> {
    await this.permissionsService.delete(permissionId);
  }
}
