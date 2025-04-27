import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserResolver } from './resolver/user.resolver';

@Module({
  providers: [UserService, UserRepository, UserResolver],
  exports: [UserService],
})
export class UserModule {}
