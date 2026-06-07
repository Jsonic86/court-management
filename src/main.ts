import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Prefix tĩnh cho mọi route: /api/v2/... (vd POST /api/v2/seller-templates)
  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api/v2');
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
