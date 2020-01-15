import { Request, Response } from 'express';

import {
  BadRequest,
  Unauthorized,
  NotFound,
  CustomError,
  InternalServerError,
  Conflict,
} from '../../../errors';

export const errorHandlerMiddleware = (req: Request, res: Response) =>
  (err: any, request: Request, response: Response): Response => {
    let status = 500;
    let throwErr = err;

    if (throwErr instanceof BadRequest) {
      status = 400;
    }

    if (throwErr instanceof Unauthorized) {
      status = 400;
    }

    if (err instanceof NotFound) {
      status = 404;
    }

    if (err.code && err.code === 'ER_DUP_ENTRY') {
      status = 409;
      throwErr = new Conflict('Already exists resource with received unique keys');
    }

    if (!(throwErr instanceof CustomError)) {
      throwErr = new InternalServerError(throwErr.message);
    }

    return res
      .status(status)
      .send(throwErr.toJSON());
  };
