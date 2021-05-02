import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { auth } from './middleware/auth.middleware';
import { validateNetwork } from './middleware/networks.middleware';
import { TrotterLogger } from './utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new TrotterLogger()
    // logger: ['error', 'warn', 'debug', 'log']
  });
  
  const config = new DocumentBuilder()
  .setTitle('Trotter NFT API.')
  .setDescription('Trotter does abstraction on creation of NFT tokens on multiple EVM-based blockchain networks.')
  .setVersion('0.1')
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.use(auth, validateNetwork);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
