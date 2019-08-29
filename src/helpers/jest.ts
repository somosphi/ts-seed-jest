import joi from 'joi';
import winston from 'winston';
import database from './database';

/**
 * Checks if the object matches the schema
 * @param {Object} received Object to be checked
 * @param {import('joi').Schema} schema Joi schema
 * @returns {{ message: Function, pass: Boolean }}
 */
function toMatchSchema(received: Object, schema: joi.AnySchema) {
  const { error } = joi.validate(received, schema);

  if (!error) {
    return {
      message: () => 'received value matches it the schema',
      pass: true,
    };
  }

  return {
    message: () => `expected ${JSON.stringify(received)} to be valid, instead the validation return the error: ${JSON.stringify(error.message)}`,
    pass: false,
  };
}

expect.extend({ toMatchSchema });

winston.configure({
  transports: [new winston.transports.Console({ silent: true })],
});


afterAll(() => {
  if (database) {
    database.destroy();
  }
});
