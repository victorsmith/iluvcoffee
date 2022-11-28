import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // no longer have to explicitly specify types with @Type()
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();

/*
  Transform => turns json into instance of associated DTO class
*/
