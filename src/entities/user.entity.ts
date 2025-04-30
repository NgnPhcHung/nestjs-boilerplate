import { UserRole } from '@consts';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  firstname?: string;

  @Column({ nullable: true })
  lastname?: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastSyncTime: Date;
}
