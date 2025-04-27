import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AppRedisModule } from '@modules/redis/redis.module';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [UserModule, JwtModule.register({}), AppRedisModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
