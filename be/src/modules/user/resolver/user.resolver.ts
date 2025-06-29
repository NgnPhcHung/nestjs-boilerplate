import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { UserModel } from '@modules/auth/models/user.model';
import { CurrentUser } from '@decorators/current-user';
import { UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from '@decorators/logger';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel)
  @UseInterceptors(LoggingInterceptor)
  getMe(@CurrentUser() user: number) {
    return this.userService.findById(user);
  }
}
