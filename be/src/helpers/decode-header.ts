import { UserRole } from '@consts';
import { ERROR_CODE } from '@consts/error-code';
import { AppUnauthorizedRequest } from '@utils/network/exception';
import * as jwt from 'jsonwebtoken';

interface DecodeHeader {
  userId: number;
  role: UserRole;
}

export const decodeHeader = (req: Request): DecodeHeader => {
  const authHeader = req.headers['authentication'];

  if (!authHeader) {
    return undefined;
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '')
    : authHeader;
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return decoded.sub as unknown as DecodeHeader;
  } catch (error) {
    throw new AppUnauthorizedRequest(ERROR_CODE.FAILED_TO_DECODE_AUTH, error);
  }
};
