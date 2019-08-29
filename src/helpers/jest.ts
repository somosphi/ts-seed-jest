import joi from 'joi';
import winston from 'winston';
import database from './database';

interface ToMatchSchema {
  message(): string;
  pass: boolean;
}

/**
 * Checks if the object matches the schema
 * @param received Object to be checked
 * @param schema Joi schema
 */
function toMatchSchema(received: object, schema: joi.AnySchema): ToMatchSchema {
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
