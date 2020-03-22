import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { permissionsKey } from 'src/modules/authorization/decorators/permissions.decorator';
import { ResourceOperationPair } from 'src/modules/authorization/resources/resource-operation-pair';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { ResourcePermission } from '../entities/resource-permission.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.get<ResourceOperationPair>(
      permissionsKey,
      context.getHandler(),
    );

    // If no permission metadata is set, we allow access
    if (!metadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    // For each resource-operation pair, we check if access should be allowed
    for (const [resource, operation] of metadata) {
      // We try to find resource permissions for the resource
      const resourcePermissions: ResourcePermission[] = await this.usersService.getResourcePermissions(
        user.id,
        resource,
      );

      // If no resource permissions are found
      // or all of their values for the operation are false,
      // we continue, because we may find resource permissions or 'true' value for some of
      // the next resource-operation pairs
      if (
        !resourcePermissions.length ||
        resourcePermissions.every(rp => !rp[operation])
      ) {
        continue;
      }

      // If resource permissions are found and even one of their values for the operation is 'true',
      // we allow access
      return true;
    }

    // If we reach this point, this means that no
    // resource permissions with 'true' value for any
    // of the operations and resources was found and access should be denied
    return false;
  }
}
