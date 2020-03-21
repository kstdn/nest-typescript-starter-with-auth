import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getManager, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { createHash, doesHashMatch } from '../../util/hash.util';
import { RefreshToken } from '../refresh-token/entities/refresh-token.entity';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { JWTPayloadDto } from './dto/jwt-payload.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await doesHashMatch(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async validateRefreshToken(
    userId: number,
    refreshTokenToValidate: string,
  ): Promise<boolean> {
    const refreshTokenFromDB = await this.refreshTokenService.find(userId);
    if (!refreshTokenFromDB) {
      return false;
    }
    const refreshTokenFromDBValue = refreshTokenFromDB.value;
    return await doesHashMatch(refreshTokenToValidate, refreshTokenFromDBValue);
  }

  async generateAccessTokenDto(userId: number): Promise<AccessTokenDto> {
    const user = await this.usersRepository.findOne(userId);

    const payload: JWTPayloadDto = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async generateRefreshTokenDto(userId: number): Promise<RefreshTokenDto> {
    return {
      userId: userId,
      refreshToken: await this.generateRefreshToken(userId),
    };
  }

  async getExistingRefreshTokenDto(userId: number): Promise<RefreshTokenDto> {
    return {
      userId: userId,
      refreshToken: (await this.refreshTokenService.find(userId)).value,
    };
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const refreshTokenValue: string = uuidv4();

    await getManager().transaction(async transactionalEntityManager => {
      // Delete the user's old refresh tokens, if any
      await transactionalEntityManager
        .getRepository(RefreshToken)
        .createQueryBuilder()
        .delete()
        .where('"userId" = :id', { id: userId })
        .execute();

      // Create a new refresh token
      const newRefreshToken: Partial<RefreshToken> = {
        value: await createHash(refreshTokenValue),
        userId: userId,
      };

      // Create a new refresh token
      await transactionalEntityManager
        .getRepository(RefreshToken)
        .save(newRefreshToken);
    });

    // Return the unhashed value
    return refreshTokenValue;
  }

  invalidateRefreshToken(userId: number): Promise<DeleteResult> {
    return this.refreshTokenService.invalidateRefreshToken(userId);
  }
}
