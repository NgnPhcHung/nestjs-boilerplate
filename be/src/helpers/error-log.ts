import { Request } from 'express';

import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { AppException } from '@utils/network/exception';

export const createErrorLogMessage = (
  ctx: HttpArgumentsHost,
  exception: Error | AppException,
  statusCode: number,
) => {
  const req = ctx.getRequest<Request>();
  const { method, originalUrl } = req;
  return `${method} ${originalUrl} ${statusCode} \n ${JSON.stringify(exception, null, 4)} \n`;
};
