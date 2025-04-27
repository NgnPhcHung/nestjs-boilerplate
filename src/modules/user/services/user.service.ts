import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { FindOptionsWhere } from 'typeorm';
import { SignInDto } from '@modules/auth/dtos/signin.dto';
import { UserEntity } from '@entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneBy(findCondition: FindOptionsWhere<UserEntity>) {
    return this.userRepository.findOneBy(findCondition);
  }

  async findById(id: number) {
    return this.userRepository.findById(id);
  }

  async createUser(user: SignInDto) {
    return this.userRepository.save(user);
  }
}
