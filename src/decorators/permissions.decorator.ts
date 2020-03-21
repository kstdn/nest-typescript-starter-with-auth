import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const permissionsKey = 'permissions';

export const Permissions = (
  ...permissions: string[]
): CustomDecorator<string> => SetMetadata(permissionsKey, permissions);
