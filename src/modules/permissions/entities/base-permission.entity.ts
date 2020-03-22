import { BaseDBEntity } from 'src/entities/base.entity';
import { Column } from 'typeorm';

export class BasePermissionEntity extends BaseDBEntity {
  @Column({
    default: true,
  })
  createOwn: boolean;

  @Column({
    default: true,
  })
  readOwn: boolean;

  @Column({
    default: true,
  })
  updateOwn: boolean;

  @Column({
    default: true,
  })
  deleteOwn: boolean;

  @Column({
    default: false,
  })
  createAny: boolean;

  @Column({
    default: false,
  })
  readAny: boolean;

  @Column({
    default: false,
  })
  updateAny: boolean;

  @Column({
    default: false,
  })
  deleteAny: boolean;
}
