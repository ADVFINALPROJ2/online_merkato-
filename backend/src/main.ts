import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // 1. Set Global Prefix
  app.setGlobalPrefix('api');

  // 2. Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. CORS Configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // 4. Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Digital Merkato API')
    .setDescription('Backend API for Digital Merkato')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  // Changed path to 'api-docs' to avoid clashing with global 'api' prefix
  SwaggerModule.setup('api-docs', app, document);

  // 5. Start Server
  const port = process.env.PORT || 5000;
  await app.listen(port);
  
  logger.log(`Backend running on http://localhost:${port}/api`);
  logger.log(`Swagger UI: http://localhost:${port}/api-docs`);
}
bootstrap();