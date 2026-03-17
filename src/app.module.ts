import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CourtModule } from './modules/court/court.module';
import { UserModule } from './modules/user/user.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ProductModule } from './modules/product/product.module';
import { BookingModule } from './modules/booking/booking.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ImageModule } from './modules/image/image.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(config),
    CourtModule,
    UserModule,
    PaymentModule,
    ProductModule,
    BookingModule,
    AuthModule,
    ImageModule,
    RedisModule
  ],  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
