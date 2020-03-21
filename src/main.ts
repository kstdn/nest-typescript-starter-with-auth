import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { EnvDefaults } from './env.defaults';
import { EnvVariables } from './env.variables';
import { validationExceptionFactory } from './exception.factory';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Config
  const config: ConfigService = app.get(ConfigService);

  // Validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: validationExceptionFactory,
    }),
  );

  // Cookie parser
  app.use(cookieParser());

  const port = config.get(EnvVariables.Port, EnvDefaults[EnvVariables.Port]);
  await app.listen(port);
  console.info(`Listening on port: ${port}`);
}
bootstrap();
