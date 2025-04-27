import { HttpStatus } from '@nestjs/common';

type ValidationErrorMessage = {
  key: string;
  value: string;
};

export class AppException {
  private readonly statusCode: number;
  private readonly error: string;
  private readonly message: string | ValidationErrorMessage[];
  private readonly errorCode: string | null;
  private correlationId: string | null;

  constructor(
    statusCode: number,
    error: string,
    message: string | ValidationErrorMessage[],
    errorCode: string | null,
  ) {
    this.statusCode = statusCode;
    this.error = error;
    this.message = message;
    this.errorCode = errorCode;
  }

  getStatusCode() {
    return this.statusCode;
  }

  getError() {
    return this.error;
  }

  getMessage() {
    return this.message;
  }

  getErrorCode() {
    return this.errorCode;
  }

  toJson() {
    return {
      statusCode: this.statusCode,
      error: this.error,
      message: this.message,
      errorCode: this.errorCode,
      correlationId: this.correlationId,
    };
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
