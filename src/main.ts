import 'source-map-support/register';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { auth } from './middleware/auth.middleware';

async function bootstrap() {
  const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: '*',
  };
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Trotter NFT API.')
    .setDescription('Trotter does abstraction on creation of NFT tokens on multiple EVM-based blockchain networks.')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors(corsOptions);
  app.use(auth);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
