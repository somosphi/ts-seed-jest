import { AmqpIntegrationConfig, Exchange, RoutingKey } from '../types';
import { Options } from 'amqplib';

export abstract class AmqpIntegration {
  protected vhost: string;
  protected config: AmqpIntegrationConfig['config'];

  constructor({ vhost, config }: AmqpIntegrationConfig) {
    this.vhost = vhost;
    this.config = config;
  }

  get vHostName() {
    return this.vhost;
  }

  abstract init(): Promise<void>;
  abstract send(
    ex: Exchange,
    rk: RoutingKey,
    msg: object,
    additional: Options.Publish,
  ): void;
}
