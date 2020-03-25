import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { EmailDoesNotExistConstraint } from './common/validators/email-does-not-exist';
import { UsernameDoesNotExistConstraint } from './common/validators/username-does-not-exist';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AuthenticationModule,
    AuthorizationModule,
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
