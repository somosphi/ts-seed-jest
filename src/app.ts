import * as R from 'ramda';
import * as RA from 'ramda-adjunct';

import { AmqpServer } from './amqp';
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
  private amqpServer?: AmqpServer;

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
   * Returns the AMQP server
   */
  private getAmqpServer(): AmqpServer {
    if (!this.amqpServer) {
      throw new Error('Failed to start AMQP server');
    }
    return this.amqpServer;
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
   * Creates an instance of the AMQP Server
   */
  private setupAmqpServer(): void {
    const getConfig = R.pipe(
      R.pick([
        'rabbitMqHost', 'rabbitMqProtocol', 'rabbitMqPort',
        'rabbitMqUsername', 'rabbitMqPassword', 'rabbitMqReconnectTimeout',
        'rabbitMqVhostHome',
      ]),
      RA.renameKeys({
        rabbitMqHost: 'host',
        rabbitMqProtocol: 'protocol',
        rabbitMqPort: 'port',
        rabbitMqUsername: 'username',
        rabbitMqPassword: 'password',
        rabbitMqReconnectTimeout: 'reconnectTimeout',
        rabbitMqVhostHome: 'vhostHome',
      }) as (_: object) => AmqpServerConfig,
    );
    this.amqpServer = new AmqpServer(
      getConfig(this.config),
    );
  }

  /**
   * Start all servers
   */
  private async initServers(): Promise<void> {
    const httpServer = this.getHttpServer();
    httpServer.start();
    logger.info(`HTTP server started in port ${httpServer.port}`);

    const amqpServer = this.getAmqpServer();
    await amqpServer.start();
    logger.info('AMQP server started');
  }

  /**
   * Start the app
   */
  async start(): Promise<void> {
    this.setupAmqpServer();

    const container = new Container({
      mysqlDatabase: database(),
      vHostList: this.getAmqpServer().getVHostList(),
    });

    this.amqpServer?.setContainer(container);
    this.setupHttpServer(container);

    await this.initServers();
  }
}
