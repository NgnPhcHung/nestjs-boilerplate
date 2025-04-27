import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    statusCode: number,
    error: string,
    message: string,
    errorCode: string | null,
  ) {
    super({ statusCode, error, message, errorCode }, statusCode);
  }
}

export class AppNotFoundException extends AppException {
  constructor(code: string, message: string = null) {
    super(
      HttpStatus.NOT_FOUND,
      'Not Found',
      message ? message : 'Not Found',
      code,
    );
  }
}

export class AppForbiddenException extends AppException {
  constructor(code: string, message: string = null) {
    super(HttpStatus.FORBIDDEN, 'Forbidden', message ?? 'Forbidden', code);
  }
}

export class AppBadRequest extends AppException {
  constructor(code: string, message: string = null) {
    super(
      HttpStatus.BAD_REQUEST,
      'Bad Request',
      message ?? 'Bad Request',
      code,
    );
  }
}

export class AppUnauthorizedRequest extends AppException {
  constructor(code: string, message: string = null) {
    super(
      HttpStatus.UNAUTHORIZED,
      'Unauthorized',
      message ?? 'Unauhorized',
      code,
    );
  }
}
