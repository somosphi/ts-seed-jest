import { RabbitMQ } from '../rabbit';
import { Container } from '../../container';
import { UserConsumer } from '../consumers/user';

import { AmqpConfig, IVhost } from '../../types';

export class HomeVhost extends RabbitMQ implements IVhost {
  private container: Container | null;

  constructor(config: AmqpConfig, container?: Container) {
    super({
      config,
      vhost: config.vhostHome,
    });
    this.container = container || null;
  }

  private loadConsumers() {
    return [
      new UserConsumer({
        container: this.container!,
        config: this.config,
      }),
    ];
  }

  setContainer(c: Container) {
    this.container = c;
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
