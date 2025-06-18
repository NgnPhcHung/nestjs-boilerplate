import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(+process.env.SALT_ROUND);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
) => {
  const isValidPassword = await bcrypt.compare(password, hashedPassword);
  return isValidPassword;
};
