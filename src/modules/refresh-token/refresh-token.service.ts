import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly em: EntityManager
  ) {}

  async find(userId: number): Promise<RefreshToken> {
    return await this.em
      .getRepository(RefreshToken)
      .createQueryBuilder('refreshToken')
      .where('refreshToken.userId = :id', { id: userId })
      .orderBy('created', 'DESC')
      .getOne();
  }

  invalidateRefreshToken(
    userId: number,
    entityManager?: EntityManager,
  ): Promise<DeleteResult> {
    const em: EntityManager = entityManager ?? this.em;
    return em
      .getRepository(RefreshToken)
      .createQueryBuilder('refreshToken')
      .delete()
      .where('refreshToken.userId = :id', { id: userId })
      .execute();
  }
}
