import { HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';

interface CustomExtension {
  statusCode: HttpStatus;
  error: GraphQLError;
  message: string;
  errorCode: string;
}

export class AppException extends GraphQLError {
  constructor(
    statusCode: number,
    error: string,
    message: string,
    errorCode: string | null,
  ) {
    super(errorCode, {
      extensions: {
        statusCode,
        error,
        message,
        errorCode,
      },
    });
  }

  toJSON() {
    const extensions = this.extensions as unknown as CustomExtension;
    return {
      statusCode: extensions.statusCode,
      error: extensions.error,
      message: extensions.message,
      errorCode: extensions.errorCode,
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

export class AppConflictException extends AppException {
  constructor(code: string, message: string = null) {
    super(HttpStatus.CONFLICT, 'Conflict', message ?? 'Conflict', code);
  }
}
