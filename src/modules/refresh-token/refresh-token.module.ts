import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  exports: [TypeOrmModule, RefreshTokenService],
  providers: [RefreshTokenService],
})
export class RefreshTokenModule {}
