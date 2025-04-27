import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SignUpDto } from './dtos/signup.dto';
import { AuthService } from './services/auth.service';
import { Public } from '@decorators/public';
import { AuthResponse } from './models/auth-response.model';
import { SignInDto } from './dtos/signin.dto';
import { UserModel } from './models/user.model';

@Resolver(() => UserModel)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponse)
  async login(@Args('input') input: SignInDto): Promise<AuthResponse> {
    return this.authService.login(input);
  }

  @Public()
  @Mutation(() => AuthResponse)
  async register(@Args('input') input: SignUpDto): Promise<AuthResponse> {
    return this.authService.signUp(input);
  }

  @Query(() => String)
  ping() {
    return 'pong';
  }
}
