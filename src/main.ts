import 'dotenv/config';

import { AppModule } from '@infrastructure/modules/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {});
  const logger = new Logger('NestApplication');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      enableDebugMessages: true,
    }),
  );

  await app.listen(port, '0.0.0.0', () => logger.log(`🚀 Application started on port: ${port}`));
}

bootstrap();
