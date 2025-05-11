import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AppException } from './exception';
import { Response } from 'express';

@Catch()
export class AppExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const type = host.getType();

    if (['graphql'].includes(host.getType())) {
      if (exception instanceof AppException) {
        const status = exception.toJSON();
        throw new HttpException(
          this._response(status.statusCode, exception),
          status.statusCode,
        );
      }
    }

    if (type === 'rpc') {
      if (exception instanceof AppException) {
        throw new RpcException(exception.toJSON());
      }

      if (exception instanceof RpcException) {
        throw exception; // Already good
      }

      throw new RpcException({
        code: 13,
        message: exception || 'Unhandled gRPC error',
      });
    }

    // fallback for http if needed
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    response.status(status).json(this._response(status, exception));
  }

  private _response(status: number, exception: any) {
    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception?.message,
      error: exception?.name,
    };
  }
}
