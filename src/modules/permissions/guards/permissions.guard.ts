import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { permissionsKey } from 'src/modules/permissions/decorators/permissions.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { ResourceActionPair } from 'src/modules/permissions/resources/actions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.get<ResourceActionPair>(
      permissionsKey,
      context.getHandler(),
    );

    // If no permission metadata is set, we allow access
    if (!metadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    // For each resource-action pair, we check if access should be allowed
    for (const [resource, action] of metadata) {
      // We try to find permissionToUser for the resource
      const permissionToUser = await this.usersService.getResourcePermissionToUser(
        user.id,
        resource,
      );

      // If no permissionToUser is found for the resource
      // or the value it has for the action is false,
      // we continue, because we may find a permissionToUser or 'true' value for some of
      // the next resource-action pairs
      if (!permissionToUser || !permissionToUser[action]) {
        continue;
      }

      // If a permissionToUser is found and the value it has for the action is true,
      // we allow access
      return true;
    }

    // If we reach this point, this means that no
    // permissionToUser with 'true' value for any
    // of the actions and resources was found and access should be denied
    return false;
  }
}
