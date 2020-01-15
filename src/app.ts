import { HttpServer } from './http';
import { Container } from './container';
import { Logger as logger } from './logger';
import database from './helpers/database';

import { AppConfig } from './types';

export class Application {
  private readonly config: AppConfig;
  private httpServer?: HttpServer;

  constructor(config: AppConfig) {
    this.config = config;
  }

  getHttpServer(): HttpServer {
    if (!this.httpServer) {
      throw new Error('Failed to start server');
    }
    return this.httpServer;
  }

  async start(): Promise<void> {
    const {
      httpPort,
      httpBodyLimit,
    } = this.config;

    const container = new Container({
      mysqlDatabase: database(),
    });

    this.httpServer = new HttpServer(container, {
      port: httpPort,
      bodyLimit: httpBodyLimit,
    });

    this.httpServer.start();
    logger.info(`Http server started in port ${this.httpServer.port}`);
  }
}
