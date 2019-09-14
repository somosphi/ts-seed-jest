import { Request, Response } from 'express';
import { ResourceNotFoundError, CodedError, NotFoundError } from '../../../errors';
import { logger } from '../../../logger';

export const errorHandlerMiddleware = (req: Request, res: Response) =>
  (err: any, request: Request, response: Response): Response => {
    if (err instanceof CodedError) {
      logger.warn(err);
    } else {
      logger.error(err);
    }

    if (err instanceof NotFoundError || err instanceof ResourceNotFoundError) {
      return res.status(404).send(err);
    }

    if (err.code && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).send({
        code: 'DUPLICATED_RESOURCE',
        message: 'Already exists resource with received unique keys',
      });
    }

    return res.status(500).send({
      code: 'UNEXPECTED_ERROR',
      message: 'Internal server failure',
    });
  };
