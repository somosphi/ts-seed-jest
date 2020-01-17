import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';

import { ExpressLogger } from '../logger';
import { Container } from '../container';
import { UserController } from './controllers/v1/user';
import { Controller } from './controllers/controller';
import { errorHandlerMiddleware } from './middlewares/errorHandler';
import { NotFound } from '../errors';

import { HttpServerConfig } from '../types';

export class HttpServer {
  private app?: express.Application;
  private readonly container: Container;
  private readonly config: HttpServerConfig;

  constructor(container: Container, config: HttpServerConfig) {
    this.container = container;
    this.config = config;
  }

  get port(): number {
    return this.config.port;
  }

  getApp(): express.Application {
    if (!this.app) {
      throw new Error('Http server doesn\'t started');
    }
    return this.app;
  }

  protected loadControllers(): Controller[] {
    return [
      new UserController(this.container),
    ];
  }

  start(): void {
    if (this.app) {
      return;
    }

    /* Express initialization */
    const app = express();

    /* Express utilites */
    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.json({
      limit: this.config.bodyLimit,
    }));

    /** Add Logger to Express */
    app.use(ExpressLogger.onSuccess.bind(ExpressLogger));
    app.use(ExpressLogger.onError.bind(ExpressLogger));

    /* Status endpoint */
    app.get(
      ['/info', '/status'],
      async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          res.sendStatus(204);
        } catch (err) {
          next(err);
        }
      },
    );

    this.loadControllers()
      .forEach((controller) => {
        const router = express.Router({ mergeParams: true });
        controller.register(router);
        app.use(router);
      });

    app.use(
      '*',
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        next(new NotFound('Page not found'));
      },
    );

    app.use(errorHandlerMiddleware);
    app.listen(this.config.port);

    this.app = app;
  }
}
