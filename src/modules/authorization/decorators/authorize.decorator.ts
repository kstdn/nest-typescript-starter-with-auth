import { applyDecorators, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from 'src/modules/authorization/guards/permissions.guard';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { ResourceOperationPair } from 'src/modules/authorization/resources/resource-operation-pair';
import { Permission } from './permissions.decorator';

export function Authorize(
  ...resourceOperationPairs: ResourceOperationPair[]
): any {
  return applyDecorators(
    Permission(...resourceOperationPairs),
    UseGuards(JwtAuthGuard),
    UseGuards(PermissionsGuard),
  );
}
