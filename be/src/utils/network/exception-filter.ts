import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from './exception';

@Catch(AppException)
export class AppExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status;

    if (['graphql'].includes(host.getType())) {
      if (exception instanceof AppException) {
        const exceptionJson = exception.toJSON();
        status = exceptionJson.statusCode;

        throw new HttpException(
          this._response(status, request, exception),
          status,
        );
      }
    }
    response.status(status).json(this._response(status, request, exception));
  }

  private _response(
    status: number,
    request: Request,
    exception: AppException | any,
  ) {
    const exceptionJson = exception.toJSON();
    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request?.url,
      method: request?.method,
      params: request?.params,
      query: request?.query,
      exception: exceptionJson,
    };
  }
}
