import { curryN } from 'ramda';
import { Schema } from '@hapi/joi';
import { AmqpMessage } from '../../types';
import { BadRequest } from '../../errors';

export const validatorMiddleware = curryN(
  2,
  (schema: Schema, msg: AmqpMessage): AmqpMessage => {
    const validation = schema.validate(msg, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
    });

    if (validation.error) {
      throw new BadRequest('Invalid request params', validation.error.details);
    }

    return msg;
  },
);
