import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity()
export class Role {
  @PrimaryColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Promise<Permission[]>;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
