import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AppRedisModule } from '@modules/redis/redis.module';
import { AuthResolver } from './auth.resolver';
import { TrieService } from './services/trie/trie.service';
import { PrismaModule } from '@modules/prisma/prisma.module';

@Module({
  imports: [UserModule, JwtModule.register({}), AppRedisModule, PrismaModule],
  providers: [AuthService, AuthResolver, TrieService],
  exports: [AuthService],
})
export class AuthModule {}
