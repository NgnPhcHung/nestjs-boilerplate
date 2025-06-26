import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { UserModel } from '@modules/auth/models/user.model';
import { CurrentUser } from '@decorators/current-user';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel)
  getMe(@CurrentUser() user: number) {
    console.log({ user });

    return this.userService.findById(user);
  }
}
