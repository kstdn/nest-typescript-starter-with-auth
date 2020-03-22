import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ResourceOperationPair } from 'src/modules/authorization/resources/resource-operation-pair';

export const permissionsKey = 'permissions';

export const Permission = (
  ...resourceOperationPair: ResourceOperationPair[]
): CustomDecorator<string> =>
  SetMetadata(permissionsKey, resourceOperationPair);
