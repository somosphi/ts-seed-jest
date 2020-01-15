import { Options } from 'amqplib';

import { Logger } from '../../logger';

import { Exchange, RoutingKey, QueueMessage } from '../../types';
import { UserIntegrationAmqpConfig, IUserProducer } from '../../types/User';

export class UserProducer implements IUserProducer {
  private readonly exchange: Exchange;
  private readonly routingKey: RoutingKey;
  private vhost: UserIntegrationAmqpConfig['vhost'];

  constructor(config: UserIntegrationAmqpConfig) {
    this.exchange = config.exchange;
    this.routingKey = config.routingKey;
    this.vhost = config.vhost;
  }

  send(msg: QueueMessage) {
    try {
      const pubOpts: Options.Publish = {
        priority: 0,
        deliveryMode: 2,
        contentEncoding: 'UTF-8',
        contentType: 'application/json',
      };

      this.vhost.send(this.exchange, this.routingKey, msg, pubOpts);
      Logger
        .info(`Sending msg to exchange (${this.exchange}) and routing key (${this.routingKey})`);
    } catch (err) {
      Logger
        .error(`Error sending message to exchange (${this.exchange}) and routing key (${this.routingKey}): ${err}`);
    }
  }
}
