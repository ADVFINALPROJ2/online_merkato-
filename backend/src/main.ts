import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
  origin: [
    'https://online-merkato-pi.vercel.app',
    'http://localhost:3000',
  ],
  credentials: true,
});

  const config = new DocumentBuilder()
    .setTitle('Digital Merkato API')
    .setDescription('Backend API for Digital Merkato')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port);

  logger.log(`Backend running on port ${port}`);
  logger.log(`API: http://localhost:${port}/api`);
  logger.log(`Swagger: http://localhost:${port}/api-docs`);
}

bootstrap();