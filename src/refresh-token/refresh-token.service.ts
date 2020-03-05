import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async find(userId: number): Promise<RefreshToken> {
    return await this.refreshTokenRepository
      .createQueryBuilder()
      .where('"userId" = :id', { id: userId })
      .orderBy('created', 'DESC')
      .getOne();
  }

  invalidateRefreshToken(userId: number): Promise<DeleteResult> {
    return this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .where('"userId" = :id', { id: userId })
      .execute();
  }
}
