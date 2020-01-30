import { Logger } from '../../logger';
import { HomeVhost } from '../../amqp/vhost/home';

import { IVhost, ProducerQueueConfig } from '../../types';
import { UserIntegrationAmqpConfig, IUserProducer, User } from '../../types/User';

export class UserProducer implements IUserProducer {
  private vhost: IVhost;
  private readonly queueConfigs: ProducerQueueConfig;

  constructor(config: UserIntegrationAmqpConfig) {
    const vhost = config.vhost.find(v => v instanceof HomeVhost);

    if (!vhost) throw new Error('No vHost found for UserProducer');

    this.vhost = vhost;
    this.queueConfigs = this.getConfig();
  }

  private getConfig(): ProducerQueueConfig {
    return {
      findUser: {
        exchange: 'tsseed.fx',
        routingKey: '',
        pubOpts: {
          persistent: true,
          CC: ['user.get'],
        },
      },
      notifyUserCreation: {
        exchange: 'tsseed.fx',
        routingKey: '',
        pubOpts: {
          persistent: true,
          CC: ['user.create'],
        },
      },
    };
  }

  sendFindUser(msg: Partial<Omit<User, 'createdAt' | 'updatedAt'>>) {
    const configs = this.queueConfigs.findUser;
    const rk = configs.routingKey;
    const ex = configs.exchange;
    try {
      this.vhost.send(ex, rk, msg, configs.pubOpts!);
      Logger
        .info(`Sending msg to exchange (${ex}) and routing key (${rk})`);
    } catch (err) {
      Logger
        .error(`Error sending message to exchange (${ex}) and routing key (${rk}): ${err}`);
    }
  }

  sendUserCreated(msg: Partial<Omit<User, 'createdAt' | 'updatedAt'>>) {
    const configs = this.queueConfigs.notifyUserCreation;
    const rk = configs.routingKey;
    const ex = configs.exchange;
    try {
      this.vhost.send(ex, rk, msg, configs.pubOpts!);
      Logger
        .info(`Sending msg to exchange (${ex}) and routing key (${rk})`);
    } catch (err) {
      Logger
        .error(`Error sending message to exchange (${ex}) and routing key (${rk}): ${err}`);
    }
  }
}
