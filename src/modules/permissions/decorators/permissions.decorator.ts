import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ResourceActionPair } from 'src/modules/permissions/resources/actions';

export const permissionsKey = 'permissions';

export const Permission = (
  ...resourceActionPair: ResourceActionPair[]
): CustomDecorator<string> => SetMetadata(permissionsKey, resourceActionPair);
