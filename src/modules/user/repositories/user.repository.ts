import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { DataSource, Repository, LessThan, IsNull } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findByEmail(email: string) {
    return this.findOneBy({ email });
  }

  async findById(id: number) {
    return this.findOneBy({ id });
  }

  async findUsersForSync() {
    return this.find({
      where: [
        {
          lastSyncTime: LessThan(new Date(Date.now())),
        },
        {
          lastSyncTime: IsNull(),
        },
      ],
      select: {
        username: true,
        id: true,
        lastSyncTime: true,
      },
    });
  }
}
