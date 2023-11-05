import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const salt = parseInt(process.env.BCRYPT_SALT!);

  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
