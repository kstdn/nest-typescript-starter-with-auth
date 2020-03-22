import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvVariables } from '../../env.variables';
import { EnvDefaults } from '../../env.defaults';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

const jwtValidityInMs = (config: ConfigService): number => {
  return config.get(
    EnvVariables.JwtValidityInMs,
    EnvDefaults[EnvVariables.JwtValidityInMs],
  );
};

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get(EnvVariables.JwtSecret),
        signOptions: { expiresIn: `${jwtValidityInMs(config)}ms` },
      }),
      inject: [ConfigService],
    }),
    RefreshTokenModule,
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
