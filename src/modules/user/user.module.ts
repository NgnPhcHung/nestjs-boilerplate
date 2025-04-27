import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';

@Module({
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
