import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { UserModel } from '@modules/auth/models/user.model';
import { CurrentUser } from '@decorators/current-user';
import { Roles } from '@decorators/role';
import { UserRole } from '@consts';
import { ApiKeyGuard } from '@guards/ApiKeyGuard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel)
  @Roles([UserRole.ADMIN])
  @UseGuards(ApiKeyGuard)
  getMe(@CurrentUser() user: { userId: number }) {
    return this.userService.findById(user.userId);
  }
}
