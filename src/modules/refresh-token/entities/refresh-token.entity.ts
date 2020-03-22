import { BaseDBEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class RefreshToken extends BaseDBEntity {
  @Column()
  value: string;

  @Column()
  userId: string;

  @ManyToOne(
    () => User,
    user => user.refreshTokens,
  )
  user: User;
}
