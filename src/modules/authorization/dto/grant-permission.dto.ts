import { IsDefined, IsIn } from 'class-validator';
import { BaseDBEntity } from '../../../common/entities/base.entity';
import { BasePermissionEntity } from '../entities/base-permission.entity';

// We only include properties that are own properties of BasePermissionEntity
type BasePermissionEntityOwnProperties = Omit<
  BasePermissionEntity,
  keyof BaseDBEntity
>;

const IsBooleanLike = (): ((
  object: Record<string, any>,
  propertyName: string,
) => void) => IsIn(['true', 'false', true, false]);

export class GrantPermissionDto implements BasePermissionEntityOwnProperties {
  @IsDefined()
  @IsBooleanLike()
  createOwn: boolean;

  @IsDefined()
  @IsBooleanLike()
  readOwn: boolean;

  @IsDefined()
  @IsBooleanLike()
  updateOwn: boolean;

  @IsDefined()
  @IsBooleanLike()
  deleteOwn: boolean;

  @IsDefined()
  @IsBooleanLike()
  createAny: boolean;

  @IsDefined()
  @IsBooleanLike()
  readAny: boolean;

  @IsDefined()
  @IsBooleanLike()
  updateAny: boolean;

  @IsDefined()
  @IsBooleanLike()
  deleteAny: boolean;
}
