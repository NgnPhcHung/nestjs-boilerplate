import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { UserModel } from '@modules/auth/models/user.model';
import { CurrentUser } from '@decorators/current-user';
import { Roles } from '@decorators/role';
import { UserRole } from '@consts';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel)
  @Roles([UserRole.ADMIN])
  getUser(@CurrentUser() user: { userId: number }) {
    return this.userService.findById(user.userId);
  }
}
