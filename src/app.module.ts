import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { SellerTemplateModule } from './modules/seller-template/seller-template.module';
import { TransformInterceptor } from './common/response/transform.interceptor';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
import { ProductModule } from './modules/product/product.module';
import { SellerOrderModule } from './modules/seller-order/seller-order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(config),
    UserModule,
    AuthModule,
    SellerTemplateModule,
    ProductModule,
    SellerOrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
