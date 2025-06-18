import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserResolver } from './resolver/user.resolver';
import { AppRedisModule } from '@modules/redis/redis.module';
import { PrismaModule } from '@modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserResolver, AppRedisModule],
  exports: [UserService],
})
export class UserModule {}
