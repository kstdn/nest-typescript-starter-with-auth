import * as bcrypt from 'bcrypt';

export const createHash = async (value: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(value, saltRounds);
};

export const doesHashMatch = async (
  value: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(value, hash);
};
