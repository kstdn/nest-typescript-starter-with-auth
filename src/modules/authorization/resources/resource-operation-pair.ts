import { Resource } from './resource';
import { BasePermissionEntity } from '../entities/base-permission.entity';

export type ResourceOperationPair = [Resource, keyof BasePermissionEntity];
