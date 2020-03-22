import { Exclude } from 'class-transformer';
import { BaseDBEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { RefreshToken } from '../../refresh-token/entities/refresh-token.entity';
import { ResourcePermissionToUser } from '../../authorization/entities/resource-permission.entity';
import { Role } from '../../authorization/entities/role.entity';

@Entity()
export class User extends BaseDBEntity {
  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @OneToMany(
    () => RefreshToken,
    refreshToken => refreshToken.user,
  )
  refreshTokens: Promise<RefreshToken[]>;

  @OneToMany(
    type => ResourcePermissionToUser,
    resourcePermissionToUser => resourcePermissionToUser.user,
  )
  resourcePermissions: ResourcePermissionToUser[];

  @ManyToMany(() => Role, role => role.users)
  @JoinTable()
  roles: Promise<Role[]>;
}
