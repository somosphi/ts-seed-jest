import { Container } from '../container';
import { AmqpServerConfig, IRabbitMq } from '../types';
import { HomeVhost } from './vhost/home';

export class AmqpServer {
  private readonly config: AmqpServerConfig;
  private readonly container: Container;

  constructor(container: Container, config: AmqpServerConfig) {
    this.config = config;
    this.container = container;
  }

  private loadVHosts(): IRabbitMq[] {
    return [
      new HomeVhost(this.container, this.config),
    ];
  }

  start(): Promise<void[]> {
    return Promise.all(
      this.loadVHosts()
        // rise the consumers
        .map(vh => vh.startup()),
    );
  }
}
