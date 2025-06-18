import { ERROR_CODE } from '@consts/error-code';
import { AuthService } from '@modules/auth/services/auth.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AppUnauthorizedRequest } from '@utils/network/exception';
import { Request } from 'express';

@Injectable()
export class AccessTokenBlacklistGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new AppUnauthorizedRequest(ERROR_CODE.TOKEN_IS_MISSING);
    }

    const isBlacklisted = await this.authService.isBlacklisted(token);

    if (isBlacklisted) {
      throw new AppUnauthorizedRequest(ERROR_CODE.BLACKLISTED_TOKEN);
    }

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
