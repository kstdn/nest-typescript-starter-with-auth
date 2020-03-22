import { Column, Entity, ManyToOne } from 'typeorm';
import { BasePermissionEntity } from './base-permission.entity';
import { Resource } from './resource.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ResourcePermissionToUser extends BasePermissionEntity {
  @Column()
  public resourceId: number;

  @Column()
  public userId: number;

  @ManyToOne(type => Resource)
  public resource: Resource;

  @ManyToOne(
    type => User,
    user => user.resourcePermissions,
  )
  public user: User;
}
