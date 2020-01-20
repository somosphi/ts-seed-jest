import joi from '@hapi/joi';

export const findUserSchema = joi.object({
  content: joi.object({
    id: joi.string().required(),
  }),
});

export const createUserSchema = joi.object({
  content: joi.object({
    name: joi.string().required(),
    emailAddress: joi.string().email(),
    username: joi.string(),
  }),
});
