import { applyDecorators, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from 'src/modules/permissions/guards/permissions.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ResourceActionPair } from 'src/modules/permissions/resources/actions';
import { Permission } from './permissions.decorator';

export function Authorize(...resourceActionPairs: ResourceActionPair[]): any {
  return applyDecorators(
    Permission(...resourceActionPairs),
    UseGuards(JwtAuthGuard),
    UseGuards(PermissionsGuard),
  );
}
