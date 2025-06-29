import { GraphQLContext } from '@types';

export const setCookie = (
  context: GraphQLContext,
  key: string,
  content: any,
) => {
  const { res } = context;

  res.cookie(key, content, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: +process.env.REFRESH_COOKIE_EXPIRED_IN,
    path: '/',
  });
};
