import { BaseDBEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { ResourcePermissionToRole } from './permission-to-role.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Role extends BaseDBEntity {
  @Column({
    unique: true,
  })
  name: string;

  @OneToMany(
    type => ResourcePermissionToRole,
    resourcePermissionToRole => resourcePermissionToRole.role,
  )
  resourcePermissions: ResourcePermissionToRole[];

  @ManyToMany(() => User, user => user.roles)
  users: Promise<User[]>;
}
