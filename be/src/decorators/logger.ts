import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { finalize, Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler().name;
    const now = Date.now();

    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();
    const info = gqlContext.getInfo();
    const operation = info.operation.operation;
    const fieldName = info.fieldName;

    console.log({ operation: ctx.req.cookies });

    return next.handle().pipe(
      tap((data) =>
        console.log(
          `[${handler}] executed in ${Date.now() - now}ms, result:`,
          data,
        ),
      ),
      finalize(() => {
        console.log(
          `[${operation.toUpperCase()} ${fieldName}] executed in ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
