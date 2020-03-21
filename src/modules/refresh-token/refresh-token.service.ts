import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager, Repository, getManager } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async find(userId: number): Promise<RefreshToken> {
    return await this.refreshTokenRepository
      .createQueryBuilder('refreshToken')
      .where('refreshToken.userId = :id', { id: userId })
      .orderBy('created', 'DESC')
      .getOne();
  }

  invalidateRefreshToken(
    userId: number,
    entityManager?: EntityManager,
  ): Promise<DeleteResult> {
    const em: EntityManager = entityManager ?? getManager();
    return em
      .getRepository(RefreshToken)
      .createQueryBuilder()
      .delete()
      .where('"userId" = :id', { id: userId })
      .execute();
  }
}
