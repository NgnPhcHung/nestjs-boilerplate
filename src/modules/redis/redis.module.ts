import { RedisModule } from '@nestjs-modules/ioredis';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log({
          type: 'single',
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB'),
          options: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        });

        return {
          type: 'single',
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB'),
          options: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class AppRedisModule {}
