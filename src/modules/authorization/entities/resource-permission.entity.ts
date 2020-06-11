import { Expose, Transform } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToOne,
  TableInheritance,
  ChildEntity,
} from 'typeorm';
import { BasePermissionEntity } from './base-permission.entity';
import { Resource } from './resource.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from './role.entity';

enum ResourcePermissionType {
  ResourcePermissionToUser = 'ResourcePermissionToUser',
  ResourcePermissionToRole = 'ResourcePermissionToRole',
}

@Entity()
@TableInheritance({
  column: { type: 'enum', enum: ResourcePermissionType, name: 'type' },
})
export class ResourcePermission extends BasePermissionEntity {
  @Column()
  public resourceId: string;

  @Expose({ name: 'resourceName' })
  @Transform(resource => resource.name)
  @ManyToOne(type => Resource)
  public resource: Resource;
}

@ChildEntity(ResourcePermissionType.ResourcePermissionToUser)
export class ResourcePermissionToUser extends ResourcePermission {
  @Column()
  public userId: string;

  @Expose({ name: 'userUsername' })
  @Transform(user => user.username)
  @ManyToOne(
    type => User,
    user => user.resourcePermissions,
  )
  public user: User;
}

@ChildEntity(ResourcePermissionType.ResourcePermissionToRole)
export class ResourcePermissionToRole extends ResourcePermission {
  @Column()
  public roleId: string;

  @Expose({ name: 'roleName' })
  @Transform(role => role.name)
  @ManyToOne(
    type => Role,
    role => role.resourcePermissions,
  )
  public role: Role;
}
