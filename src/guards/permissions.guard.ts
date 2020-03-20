
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { permissionsKey } from 'src/decorators/permissions.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { matchPermissions } from 'src/util/permissions.util';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly usersService: UsersService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.get<string[]>(permissionsKey, context.getHandler());
        if (!requiredPermissions) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        const userPermissionNames = this.usersService.getAllUserPermissionNames(user.id);
        return matchPermissions(requiredPermissions, await userPermissionNames);
    }
}