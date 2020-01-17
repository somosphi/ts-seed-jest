import { RabbitMQ } from '../rabbit';
import { Container } from '../../container';
import { UserConsumer } from '../consumers/user';

import { AmqpConfig } from '../../types';

export class HomeVhost extends RabbitMQ {
  private container: Container;

  constructor(container: Container, config: AmqpConfig) {
    super({
      config,
      vhost: config.vhostHome,
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
