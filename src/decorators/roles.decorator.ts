import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const rolesKey = 'roles';

export const Roles = (...roles: string[]): CustomDecorator<string> =>
  SetMetadata(rolesKey, roles);
