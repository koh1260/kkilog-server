import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_ACCESS_EXPIRATION_TIME: Joi.number().required(),
  JWT_REFRESH_EXPIRATION_TIME: Joi.number().required(),
  JWT_REFRESH_HASH_SALT: Joi.number().required(),
  AWS_BUCKET_REGION: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  CORS_ORIGIN: Joi.string().required(),
  SENTRY_DSN: Joi.string().required(),
});
