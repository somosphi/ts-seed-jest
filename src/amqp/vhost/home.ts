import { RabbitMQ } from '../rabbit';
import { Container } from '../../container';
import { UserConsumer } from '../consumers/user';

import { IHomeVhost, AmqpConfig, AmqpChannel } from '../../types';

export class HomeVhost extends RabbitMQ implements IHomeVhost {
  private container: Container;

  constructor(container: Container, config: AmqpConfig) {
    super({
      config,
      vhost: 'home',
    });
    this.container = container;
  }

  private loadConsumers() {
    return [
      new UserConsumer({
        container: this.container,
        config: this.config,
      }),
    ];
  }

  startConsumers(): Promise<void[]> {
    return Promise.all(
      this.loadConsumers()
        .map(
          consumer => consumer.register(this.channel),
        ),
    );
  }
}
