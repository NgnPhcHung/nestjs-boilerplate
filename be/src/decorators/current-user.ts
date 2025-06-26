import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { decodeHeader } from 'src/helpers/decode-header';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx);
    const request = context.getContext().req;
    const decodedHeader = decodeHeader(request);

    return decodedHeader.userId;
  },
);
