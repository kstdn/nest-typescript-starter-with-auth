import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { validationExceptionFactory } from './common/exceptions/exception.factory';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { EnvDefaults } from './env.defaults';
import { EnvVariables } from './env.variables';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Config
  const config: ConfigService = app.get(ConfigService);

  // CORS
  app.enableCors({ origin: config.get(EnvVariables.AllowedOrigin), credentials: true })

  // Validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: validationExceptionFactory,
      transform: true,
      whitelist: true
    }),
  );

  // Cookie parser
  app.use(cookieParser());

  // Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = config.get(EnvVariables.Port, EnvDefaults[EnvVariables.Port]);
  await app.listen(port);
  console.info(`Listening on port: ${port}`);
}
bootstrap();
