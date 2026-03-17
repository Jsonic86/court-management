import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from 'src/services/redis/redis.service';
// import { RedisService } from './redis.service';

@Global() // Dùng @Global để không phải import RedisModule ở khắp mọi nơi
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        // Nếu dùng Docker local thì để host: 'localhost', port: 6379
        // Nếu dùng Upstash Cloud thì dán thẳng chuỗi URL vào: new Redis('rediss://...')
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT',RedisService],
})
export class RedisModule {}