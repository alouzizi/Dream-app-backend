import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  const config = new DocumentBuilder()
  .setTitle('User API')
  .setDescription('The User API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  //use cors
  app.enableCors({

   origin: true,
    credentials: true,  // Allow sending credentials such as cookies
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

  });
  

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
