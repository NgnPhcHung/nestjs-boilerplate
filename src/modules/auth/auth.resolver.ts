import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SignUpDto } from './dtos/signup.dto';
import { AuthService } from './services/auth.service';
import { Public } from '@decorators/public';
import { AuthResponse } from './models/auth-response.model';
import { SignInDto } from './dtos/signin.dto';
import { UserModel } from './models/user.model';
import { UserService } from '@modules/user/services/user.service';
import { Throttle } from '@nestjs/throttler';

@Resolver(() => UserModel)
@Throttle({ default: { limit: 3, ttl: 60000 } })
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Mutation(() => AuthResponse)
  async login(@Args('input') input: SignInDto): Promise<AuthResponse> {
    return this.authService.login(input);
  }

  @Public()
  @Mutation(() => AuthResponse)
  async register(@Args('input') input: SignUpDto): Promise<AuthResponse> {
    const result = await this.authService.signUp(input);
    console.log(result);
    return result;
  }

  @Query(() => String)
  ping() {
    return 'pong';
  }
}
