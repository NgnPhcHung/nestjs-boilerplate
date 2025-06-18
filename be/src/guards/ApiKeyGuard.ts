import { ERROR_CODE } from '@consts/error-code';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AppUnauthorizedRequest } from '@utils/network/exception';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-api-key'] ?? req.query.api_key;
    if (!key) {
      throw new AppUnauthorizedRequest(ERROR_CODE.X_API_KEY_IS_MISSING);
    }
    if (key !== process.env.X_API_KEY) {
      throw new AppUnauthorizedRequest(ERROR_CODE.X_API_KEY_INVALID);
    }
    return true;
  }
}
