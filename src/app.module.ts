import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailDoesNotExistConstraint } from './validators/email-does-not-exist';
import { UsernameDoesNotExistConstraint } from './validators/username-does-not-exist';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [UsernameDoesNotExistConstraint, EmailDoesNotExistConstraint],
})
export class AppModule {}
