import { Public } from '@decorators/public';
import { Res } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const { refreshToken, accessToken } = await this.authService.login(input);
    res.cookie('refreshToken', refreshToken, {
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const { refreshToken, accessToken } = await this.authService.login(input);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: +process.env.REFRESH_EXPIRED_IN,
      path: '/',
    });
    return { accessToken };
  }

  @Query(() => String)
  ping() {
    return 'pong';
  }
}
