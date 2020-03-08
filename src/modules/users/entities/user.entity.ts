import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RefreshToken } from '../../refresh-token/entities/refresh-token.entity';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => RefreshToken,
    refreshToken => refreshToken.user,
  )
  refreshTokens: Promise<RefreshToken[]>;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Promise<Permission[]>;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Promise<Role[]>;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @VersionColumn()
  version: number;
}
