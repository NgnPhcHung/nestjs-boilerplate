import { GqlContextType } from '@nestjs/graphql';
import { Request, Response } from 'express';

export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export type GraphQLContext = GqlContextType & {
  req: Request;
  res: Response;
};
