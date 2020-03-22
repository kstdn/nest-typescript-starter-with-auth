import { Column, Entity, ManyToOne } from 'typeorm';
import { BasePermissionEntity } from './base-permission.entity';
import { Resource } from './resource.entity';
import { Role } from './role.entity';

@Entity()
export class ResourcePermissionToRole extends BasePermissionEntity {
  @Column()
  public resourceId: number;

  @Column()
  public roleId: number;

  @ManyToOne(type => Resource)
  public resource: Resource;

  @ManyToOne(
    type => Role,
    role => role.resourcePermissions,
  )
  public role: Role;
}
