import joi from '@hapi/joi';

export const findUserSchema = joi.object({
  params: joi.object({
    id: joi.string().required(),
  }),
  content: joi.object({
    id: joi.string().required(),
  }),
});
