import { AmqpIntegrationConfig, Exchange, RoutingKey, QueueMessage } from '../types';
import { Options } from 'amqplib';

export abstract class AmqpIntegration {
  protected vhost: string;
  protected config: AmqpIntegrationConfig['config'];

  constructor({ vhost, config }: AmqpIntegrationConfig) {
    this.vhost = vhost;
    this.config = config;
  }

  abstract init(): Promise<void>;
  abstract send(
    ex: Exchange,
    rk: RoutingKey,
    msg: QueueMessage,
    additional: Options.Publish,
  ): void;
}
