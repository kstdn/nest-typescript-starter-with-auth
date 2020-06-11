import { BaseDBEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Log extends BaseDBEntity {
  @Column()
  operation: 'Update' | 'Delete';

  @Column()
  entityId: string;

  @Column()
  stateBeforeOperation: string;

  @Column({
    nullable: true
  })
  stateAfterOperation: string;
}
