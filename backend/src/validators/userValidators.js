import joi from 'joi';

const optionalUrl = joi.string().uri({ scheme: ['http', 'https'] }).allow('').optional();

const socialSchema = joi.object({
  linkedin: optionalUrl,
  github: optionalUrl,
  leetcode: optionalUrl,
  website: optionalUrl,
});

export const createUserSchema = joi.object({
  username: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(4).required(),
  role: joi.string().valid('admin', 'user').optional(),
  avatarUrl: joi.string().allow('').optional(),
  social: socialSchema.optional(),
});

export const updateUserSchema = joi
  .object({
    username: joi.string().min(3).max(30),
    email: joi.string().email(),
    password: joi.string().min(4),
    role: joi.string().valid('admin', 'user'),
    avatarUrl: joi.string().allow(''),
    social: socialSchema,
  })
  .min(1);

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(4).required(),
});
