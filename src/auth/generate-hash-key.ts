import * as bcrypt from 'bcrypt';

const generateHashKey = async () => {
  return await bcrypt.genSalt(1);
};
export default generateHashKey;
