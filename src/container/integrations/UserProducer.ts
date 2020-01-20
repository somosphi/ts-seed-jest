import { Options } from 'amqplib';

import { Logger } from '../../logger';

import { Exchange, IRabbitMq } from '../../types';
import { UserIntegrationAmqpConfig, IUserProducer, User } from '../../types/User';
import { HomeVhost } from '../../amqp/vhost/home';

export class UserProducer implements IUserProducer {
  private readonly exchange: Exchange;
  private vhost: IRabbitMq;

  constructor(config: UserIntegrationAmqpConfig) {
    this.exchange = 'tsseed.fx';
    const vhost = config.vhost.find(v => v instanceof HomeVhost);

    if (!vhost) throw new Error('No vHost found for UserProducer');

    this.vhost = vhost;
  }

  sendFindUser(msg: Partial<Omit<User, 'createdAt' | 'updatedAt'>>) {
    const rk = 'user.get';
    try {
      const pubOpts: Options.Publish = {
        priority: 0,
        deliveryMode: 2,
        contentEncoding: 'UTF-8',
        contentType: 'application/json',
      };

      this.vhost.send(this.exchange, rk, msg, pubOpts);
      Logger
        .info(`Sending msg to exchange (${this.exchange}) and routing key (${rk})`);
    } catch (err) {
      Logger
        .error(`Error sending message to exchange (${this.exchange}) and routing key (${rk}): ${err}`);
    }
  }
}
