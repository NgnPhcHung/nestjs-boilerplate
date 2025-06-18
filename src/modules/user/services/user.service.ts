import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '@modules/redis/redis.service';
import { PrismaService } from '@modules/prisma/prisma.service';
import { SignUpDto } from '@modules/auth/dtos/signup.dto';
import { Prisma, UserRole } from 'generated/prisma';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  async findOneBy(user: Prisma.UsersWhereInput) {
    return this.prisma.users.findFirst({
      where: user,
    });
  }

  async findById(id: number) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async createUser(user: SignUpDto) {
    user.role = UserRole.USER;
    return this.prisma.users.create({ data: user });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncUsers() {
    this.logger.log('Syncing user...');

    const users = await this.prisma.users.findMany({
      where: { isSynced: false },
    });

    if (!users.length) {
      this.logger.log('Does not have new user to sync, Sync complete');
      return;
    }

    await this.redisService.addUsernames(users.map((user) => user.username));
    this.logger.log('Sync user completed');
  }
}
