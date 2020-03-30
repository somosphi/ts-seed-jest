import * as R from 'ramda';
import * as RA from 'ramda-adjunct';

import { Container } from './container';
import { Logger as logger } from './logger';
import database from './helpers/database';
import { HttpServer } from './http';

import {
  AppConfig, HttpServerConfig,
  AmqpServerConfig,
} from './types';

export class Application {
  private readonly config: AppConfig;
  private httpServer?: HttpServer;

  constructor(config: AppConfig) {
    this.config = config;
  }

  /**
   * Returns the HTTP server
   */
  private getHttpServer(): HttpServer {
    if (!this.httpServer) {
      throw new Error('Failed to start HTTP server');
    }
    return this.httpServer;
  }

  /**
   * Creates an instance of the HTTP server
   * @param container Container
   */
  private setupHttpServer(container: Container): void {
    const getServerConfig = R.pipe(
      R.pick(['httpPort', 'httpBodyLimit']),
      RA.renameKeys({
        httpPort: 'port',
        httpBodyLimit: 'bodyLimit',
      }) as (_: object) => HttpServerConfig,
    );
    this.httpServer = new HttpServer(
      container,
      getServerConfig(this.config),
    );
  }

  /**
   * Start the app
   */
  async start(): Promise<void> {
    const container = new Container({
      mysqlDatabase: database(),
    });

    this.setupHttpServer(container);

    const httpServer = this.getHttpServer();
    httpServer.start();
    logger.info(`HTTP server started in port ${httpServer.port}`);
  }
}
