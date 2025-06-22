import { Public } from '@decorators/public';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLContext } from 'src/types/common';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { AuthResponse } from './models/auth-response.model';
import { UserModel } from './models/user.model';
import { AuthService } from './services/auth.service';
import { Logger } from '@nestjs/common';
import { CurrentUser } from '@decorators/current-user';
import { Users } from 'generated/prisma';

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
    const { res } = context;
    const { refreshToken, accessToken } = await this.authService.login(input);
    res.cookie('x-refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: +process.env.REFRESH_EXPIRED_IN,
      path: '/',
    });
    return { accessToken };
  }

  @Public()
  @Mutation(() => AuthResponse)
  async register(
    @Args('input') input: SignUpDto,
    @Context() context: GraphQLContext,
  ): Promise<AuthResponse> {
    const { refreshToken, accessToken } = await this.authService.signUp(input);
    const { res } = context;
    res.cookie('x-refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: +process.env.REFRESH_EXPIRED_IN,
      path: '/',
    });

    return { accessToken };
  }

  @Public()
  @Mutation(() => AuthResponse)
  async refreshAccessToken(
    @Context() context: GraphQLContext,
    @CurrentUser() user: any,
  ) {
    const { req } = context;

    const refreshToken = req.cookies['x-refreshToken'];
    const accessToken = await this.authService.refreshTokens(
      user,
      refreshToken,
    );
    return { accessToken };
  }

  @Query(() => String)
  ping() {
    return 'pong';
  }
}
