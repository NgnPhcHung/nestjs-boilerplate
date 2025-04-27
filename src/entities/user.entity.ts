import { UserRole } from '@consts';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;
}
