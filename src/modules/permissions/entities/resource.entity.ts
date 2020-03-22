import { BaseDBEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Resource extends BaseDBEntity {
  @Column({
    unique: true,
  })
  name: string;
}
