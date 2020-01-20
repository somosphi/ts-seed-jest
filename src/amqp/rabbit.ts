import { connect, Options } from 'amqplib';

import { AmqpIntegration } from './amqp';
import { Logger as logger } from '../logger';
import { toBuffer } from '../helpers/conversion';

import {
  AmqpIntegrationConfig, Exchange,
  RoutingKey, IRabbitMq, AmqpChannel,
  AmqpConnection, AmqpPublishOptions,
} from '../types';

export abstract class RabbitMQ extends AmqpIntegration implements IRabbitMq {
  private connection: AmqpConnection;
  protected channel: AmqpChannel;

  constructor(config: AmqpIntegrationConfig) {
    super(config);
    this.connection = null as unknown as AmqpConnection;
    this.channel = null as unknown as AmqpChannel;
  }

  async init(): Promise<void> {
    try {
      this.connection = await connect(this.connectionConfig());
      logger.info(`RabbitMQ connection established on vHost - ${this.vhost}`);

      this.addErrorHandler();
      this.channel = await this.connection.createChannel();
    } catch (err) {
      logger.info(`Error connecting RabbitMQ to vHost ${this.vhost}: ${err}`);
      this.reconnect();
    }
  }

  abstract startConsumers(): Promise<void | void[]>;

  async startup(): Promise<void> {
    await this.init();
    await this.startConsumers();
  }

  private connectionConfig(): Options.Connect {
    return {
      hostname: this.config.host,
      username: this.config.username,
      password: this.config.password,
      port: this.config.port,
      protocol: this.config.protocol,
      vhost: this.vhost,
    };
  }

  private addErrorHandler() {
    this.connection.on('blocked', reason => logger.error(
      `Connection blocked: ${reason}`,
    ));
    this.connection.on('close', () => this.reconnect());
    this.connection.on('error', () => this.reconnect());
  }

  private reconnect() {
    delete this.channel;
    delete this.connection;

    logger.warn(`Trying to reconnect on vHost ${this.vhost} in ${this.config.reconnectTimeout}ms`);
    setTimeout(() => {
      this.init();
    }, this.config.reconnectTimeout);
  }

  send(ex: Exchange, rk: RoutingKey, msg: object, additional: AmqpPublishOptions) {
    try {
      this.channel.publish(ex, rk, toBuffer(msg), additional);
    } catch (err) {
      throw new Error(`Error posting message to RabbitMQ server: ${err}`);
    }
  }
}
