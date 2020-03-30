import * as R from 'ramda';
import * as RA from 'ramda-adjunct';

import { AmqpServer } from './amqp';
import { Container } from './container';
import { Logger as logger } from './logger';
import database from './helpers/database';

import {
  AppConfig,
  AmqpServerConfig,
} from './types';

export class Application {
  private readonly config: AppConfig;
  private amqpServer?: AmqpServer;

  constructor(config: AppConfig) {
    this.config = config;
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
   * Start the app
   */
  async start(): Promise<void> {
    this.setupAmqpServer();

    const container = new Container({
      mysqlDatabase: database(),
      vHostList: this.getAmqpServer().getVHostList(),
    });

    this.amqpServer?.setContainer(container);

    const amqpServer = this.getAmqpServer();
    await amqpServer.start();
    logger.info('AMQP server started');
  }
}
