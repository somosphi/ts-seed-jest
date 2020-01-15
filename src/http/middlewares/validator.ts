import { curryN } from 'ramda';
import { Schema } from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

import { BadRequest } from '../../errors';

export const validatorMiddleware = curryN(
  4,
  (schema: Schema, req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
    });

    if (validation.error) {
      return next(new BadRequest('Invalid request params', validation.error.details));
    }

    Object.assign(req, validation.value);

    return next();
  },
);
