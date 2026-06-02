import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(config),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
