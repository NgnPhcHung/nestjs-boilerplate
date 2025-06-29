import { Public } from '@decorators/public';
import { Logger } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { AuthResponse } from './models/auth-response.model';
import { UserModel } from './models/user.model';
import { AuthService } from './services/auth.service';
import { GraphQLContext } from '@types';
import { setCookie } from '@utils/setCookie';

@Resolver(() => UserModel)
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponse)
  async login(
    @Args('input') input: SignInDto,
    @Context() context: GraphQLContext,
  ): Promise<AuthResponse> {
    this.logger.log(
      `Calling ${this.login.name} with body ${JSON.stringify(input)}`,
    );
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
    this.logger.log(`Calling ${this.refreshAccessToken.name} with user:`);
    const { req } = context;
    const refreshToken = req.cookies['x-refreshToken'];
    const accessToken = await this.authService.refreshTokens(refreshToken);
    return { accessToken };
  }

  @Query(() => String)
  ping() {
    this.logger.log(`Calling ${this.ping.name} `);
    return 'pong';
  }
}
