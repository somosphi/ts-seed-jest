import elasticApmNode from 'elastic-apm-node';
import { HttpServer } from './http';
import { Container } from './container';
import { logger } from './logger';
import database from './helpers/database';
import { AppConfig } from './types';

export class Application {
  private readonly config: AppConfig;
  private httpServer?: HttpServer;
  private worker?: Worker;

  constructor (config: AppConfig) {
    this.config = config;
  }

  getHttpServer(): HttpServer {
    if (!this.httpServer) {
      throw new Error('Application doesn\'t started');
    }
    return this.httpServer;
  }

  getWorker(): Worker {
    if (!this.worker) {
      throw new Error('Application doesn\'t started');
    }
    return this.worker;
  }

  async start(): Promise<void> {
    const {
      apmServiceName,
      apmServerUrl,
      httpPort,
      httpBodyLimit,
    } = this.config;

    const container = new Container({
      mysqlDatabase: database,
    });

    if (apmServiceName && apmServerUrl) {
      elasticApmNode.start({
        serviceName: apmServiceName,
        serverUrl: apmServerUrl,
      });

      logger.info(`Registered service "${apmServiceName}" in APM Server`);
    }

    this.httpServer = new HttpServer(container, {
      port: httpPort,
      bodyLimit: httpBodyLimit,
    });

    this.httpServer.start();
    logger.info(`Http server started in port ${this.httpServer.port}`);
  }
}
