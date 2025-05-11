import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  canActivate(context: ExecutionContext): Promise<boolean> {
    const type = context.getType();
    if (type === 'rpc') {
      // Skip throttling for gRPC or implement a gRPC-compatible tracker
      return Promise.resolve(true);
    }

    return super.canActivate(context);
  }
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return { req: ctx.req, res: ctx.res }; // ctx.request and ctx.reply for fastify
  }
}
