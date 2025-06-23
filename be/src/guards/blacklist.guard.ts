import { ERROR_CODE } from '@consts/error-code';
import { IS_PUBLIC_KEY } from '@decorators/public';
import { AuthService } from '@modules/auth/services/auth.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AppUnauthorizedRequest } from '@utils/network/exception';
import { Request } from 'express';

@Injectable()
export class AccessTokenBlacklistGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new AppUnauthorizedRequest(ERROR_CODE.TOKEN_IS_MISSING);
    }

    const isBlacklisted = await this.authService.isBlacklisted(token);

    if (isBlacklisted) {
      throw new AppUnauthorizedRequest(ERROR_CODE.BLACKLISTED_TOKEN);
    }

    const test = this.jwtService.decode(token);
    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];

    if (!authHeader) return null;

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) return null;

    return token;
  }
}
