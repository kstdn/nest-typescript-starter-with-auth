import { Injectable, NotFoundException } from '@nestjs/common';
import { FilteringOptions } from 'src/common/util/filtering';
import { Exception } from '../../../common/exceptions/exception.enum';
import { isActive } from '../../../common/util/find-options.util';
import { OrderingOptions } from '../../../common/util/ordering';
import { Paginated, PaginationOptions } from '../../../common/util/pagination';
import { UsersService } from '../../users/users.service';
import { GrantPermissionDto } from '../dto/grant-permission.dto';
import {
  ResourcePermission,
  ResourcePermissionToRole,
  ResourcePermissionToUser,
} from '../entities/resource-permission.entity';
import { ResourcesService } from './resource.service';
import { RolesService } from './roles.service';
import { Resource } from '../entities/resource.entity';
import { Role } from '../entities/role.entity';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly resourcesService: ResourcesService,
    private readonly rolesService: RolesService,
  ) {}

  findAllPaginated(
    paginationOptions: PaginationOptions,
    filteringOptions: FilteringOptions,
    orderingOptions: OrderingOptions,
  ): Promise<Paginated<ResourcePermission>> {
    return ResourcePermission.findAllPaginated<ResourcePermission>(
      filteringOptions,
      paginationOptions,
      orderingOptions,
      {
        relations: ['resource', 'user', 'role'],
      },
    );
  }

  async findOneOrThrow(permissionId: string): Promise<ResourcePermission> {
    return ResourcePermission.findOneOrFail(permissionId, {
      where: isActive,
      relations: ['resource', 'user', 'role'],
    }).catch(() => {
      throw new NotFoundException(Exception.PERMISSION_NOT_FOUND);
    });
  }

  async grantToUser(
    resourceId: string,
    userId: string,
    operations: GrantPermissionDto,
  ): Promise<ResourcePermissionToUser> {
    const [resource, user] = await Promise.all([
      this.resourcesService.findOneOrThrow(resourceId),
      this.usersService.findOneOrThrow(userId),
    ]);
    const permission: ResourcePermissionToUser = new ResourcePermissionToUser();

    Object.assign(permission, operations);
    permission.user = user;
    permission.resource = resource;
    return permission.save();
  }

  async grantToRole(
    resourceId: string,
    roleId: string,
    operations: GrantPermissionDto,
  ): Promise<ResourcePermissionToRole> {
    const [resource, role] = await Promise.all<Resource, Role>([
      this.resourcesService.findOneOrThrow(resourceId),
      this.rolesService.findOneOrThrow(roleId),
    ]);
    const permission: ResourcePermissionToRole = new ResourcePermissionToRole();

    Object.assign(permission, operations);
    permission.role = role;
    permission.resource = resource;
    return permission.save();
  }

  async update(
    permissionId: string,
    operations: GrantPermissionDto,
  ): Promise<ResourcePermission> {
    const permission: ResourcePermission = await this.findOneOrThrow(
      permissionId,
    );
    Object.assign(permission, operations);
    return permission.save();
  }

  async delete(permissionId: string): Promise<ResourcePermission> {
    const permission: ResourcePermission = await this.findOneOrThrow(
      permissionId,
    );
    permission.isActive = false;
    return permission.save();
  }
}
