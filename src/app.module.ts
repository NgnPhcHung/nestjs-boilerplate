import { GqlThrottlerGuard } from '@guards/throttle.guard';
import { AuthModule } from '@modules/auth/auth.module';
import { PostgresModule } from '@modules/db/postgres.module';
import { UserModule } from '@modules/user/user.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppRedisModule } from '@modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schemas/schema.gql',
      graphiql: true,
      context: ({ req, res }) => {
        return {
          req,
          res,
        };
      },
      formatError(formattedError) {
        return {
          message: formattedError.message,
          path: formattedError.path,
          extensions: {
            status: formattedError.extensions.status,
            exception: formattedError.extensions.originalError,
          },
        };
      },
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        errorMessage: 'Too many requests! Please try again later',
        throttlers: [
          {
            limit: 5,
            ttl: 1000,
          },
        ],
      }),
    }),

    ScheduleModule.forRoot(),
    AppRedisModule,
    PostgresModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
    // { provide: APP_GUARD, useClass: AccessTokenBlacklistGuard },
  ],
})
export class AppModule {}
