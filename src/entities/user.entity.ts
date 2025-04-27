import { UserRole } from '@consts';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  note: string;

  @Column()
  roleId: number;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;
}
