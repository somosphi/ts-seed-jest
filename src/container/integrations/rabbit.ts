import { Connection, Channel, connect, Options } from 'amqplib';

import { AmqpIntegration } from './amqp';
import { Logger as logger } from '../../logger';
import { toBuffer } from '../../helpers/conversion';

import {
  AmqpIntegrationConfig, Exchange,
  RoutingKey, QueueMessage, IRabbitMq,
} from '../../types';

export class RabbitMQ extends AmqpIntegration implements IRabbitMq {
  private connection: Connection;
  private channel: Channel;

  constructor(config: AmqpIntegrationConfig) {
    super(config);
    this.connection = null as unknown as Connection;
    this.channel = null as unknown as Channel;
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

  send(ex: Exchange, rk: RoutingKey, msg: QueueMessage, additional: Options.Publish) {
    try {
      this.channel.publish(ex, rk, toBuffer(msg), additional);
    } catch (err) {
      throw new Error(`Error posting message to RabbitMQ server: ${err}`);
    }
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
}
