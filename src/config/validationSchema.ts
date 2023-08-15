import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_ACCESS_EXPIRATION_TIME: Joi.number().required(),
  JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
  JWT_REFRESH_HASH_SALT: Joi.number().required(),
});
