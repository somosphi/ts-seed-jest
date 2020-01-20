import { curryN } from 'ramda';
import { Schema } from '@hapi/joi';
import { AmqpMessage, AmqpParsedMessage } from '../../types';
import { BadRequest } from '../../errors';

/**
 * Applies the validation of the desired message schema
 * @param schema Joi schema
 * @param msg Parsed message to validate the schema
 */
export const validatorMiddleware = curryN(
  2,
  <T>(schema: Schema, msg: AmqpParsedMessage<T>): AmqpMessage => {
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
