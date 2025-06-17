import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { FindOptionsWhere, In } from 'typeorm';
import { SignInDto } from '@modules/auth/dtos/signin.dto';
import { UserEntity } from '@entities/user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '@modules/redis/redis.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) {}

  async findOneBy(findCondition: FindOptionsWhere<UserEntity>) {
    return this.userRepository.findOneBy(findCondition);
  }

  async findById(id: number) {
    return this.userRepository.findById(id);
  }

  async createUser(user: SignInDto) {
    return this.userRepository.save(user);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncUsers() {
    this.logger.log('Syncing user...');

    const users = await this.userRepository.findUsersForSync();
    console.log({ users });

    if (!users.length) {
      this.logger.log('Does not have new user to sync, Sync complete');
      return;
    }

    await this.redisService.addUsernames(users.map((user) => user.username));
    await this.userRepository.update(
      {
        id: In(users.map((user) => user.id)),
      },
      {
        isSynced: false,
      },
    );

    this.logger.log('Sync user completed');
  }
}
