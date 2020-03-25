import {
  Column,
  Entity,
  ManyToOne,
  TableInheritance,
  ChildEntity,
} from 'typeorm';
import { BasePermissionEntity } from './base-permission.entity';
import { Resource } from './resource.entity';
import { Role } from './role.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class ResourcePermission extends BasePermissionEntity {
  @Column()
  public resourceId: string;

  @ManyToOne(type => Resource)
  public resource: Resource;
}

@ChildEntity()
export class ResourcePermissionToUser extends ResourcePermission {
  @Column()
  public userId: string;

  @ManyToOne(
    type => User,
    user => user.resourcePermissions,
  )
  public user: User;
}

@ChildEntity()
export class ResourcePermissionToRole extends ResourcePermission {
  @Column()
  public roleId: string;

  @ManyToOne(
    type => Role,
    role => role.resourcePermissions,
  )
  public role: Role;
}
