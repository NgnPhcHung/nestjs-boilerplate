import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

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
          isSynced: false,
        },
      ],
      select: {
        username: true,
        id: true,
        isSynced: true,
      },
    });
  }
}
