import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  jwtSecretKey: process.env.JWT_SECRET_KEY,
}));
