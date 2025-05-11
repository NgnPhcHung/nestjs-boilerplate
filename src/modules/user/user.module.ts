import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserResolver } from './resolver/user.resolver';
import { AppRedisModule } from '@modules/redis/redis.module';
import { UserGrpcController } from './resolver/user.grpc.controller';

@Module({
  controllers: [UserGrpcController],
  providers: [UserService, UserRepository, UserResolver, AppRedisModule],
  exports: [UserService],
})
export class UserModule {}
