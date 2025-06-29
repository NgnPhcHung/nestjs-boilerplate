import { Public } from '@decorators/public';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLContext } from '@types';
import { setCookie } from '@utils/setCookie';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { AuthResponse } from './models/auth-response.model';
import { UserModel } from './models/user.model';
import { AuthService } from './services/auth.service';

@Resolver(() => UserModel)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponse)
  async login(
    @Args('input') input: SignInDto,
    @Context() context: GraphQLContext,
  ): Promise<AuthResponse> {
    const { refreshToken, accessToken } = await this.authService.login(input);
    setCookie(context, 'x-refreshToken', refreshToken);
    return { accessToken };
  }

  @Public()
  @Mutation(() => AuthResponse)
  async register(
    @Args('input') input: SignUpDto,
    @Context() context: GraphQLContext,
  ): Promise<AuthResponse> {
    const { refreshToken, accessToken } = await this.authService.signUp(input);
    setCookie(context, 'x-refreshToken', refreshToken);
    return { accessToken };
  }

  @Public()
  @Mutation(() => AuthResponse)
  async refreshAccessToken(@Context() context: GraphQLContext) {
    const { req } = context;
    const refreshToken = req.cookies['x-refreshToken'];
    const accessToken = await this.authService.refreshTokens(refreshToken);
    return { accessToken };
  }

  @Query(() => String)
  ping() {
    return 'pong';
  }
}
