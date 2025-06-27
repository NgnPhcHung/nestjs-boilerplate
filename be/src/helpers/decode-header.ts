import { ERROR_CODE } from '@consts/error-code';
import { AppUnauthorizedRequest } from '@utils/network/exception';
import { UserRole } from 'generated/prisma';
import * as jwt from 'jsonwebtoken';

interface DecodeHeader {
  userId: number;
  role: UserRole;
}

export const decodeHeader = (req: Request): DecodeHeader => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return undefined;
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '')
    : authHeader;
  try {
    jwt.decode(token, { complete: true });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      algorithms: ['HS256'],
    });

    if (!decoded.sub) {
      throw new AppUnauthorizedRequest(ERROR_CODE.FAILED_TO_DECODE_AUTH);
    }
    return decoded.sub as unknown as DecodeHeader;
  } catch (error) {
    throw new AppUnauthorizedRequest(ERROR_CODE.FAILED_TO_DECODE_AUTH, error);
  }
};
