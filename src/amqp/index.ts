import { Container } from '../container';
import { HomeVhost } from './vhost/home';

import { AmqpServerConfig, IRabbitMq } from '../types';

export class AmqpServer {
  private readonly config: AmqpServerConfig;
  private readonly container: Container;
  private vHostList: IRabbitMq[];

  constructor(container: Container, config: AmqpServerConfig) {
    this.config = config;
    this.container = container;
    this.vHostList = [];
  }

  getVHostList(): IRabbitMq[] {
    return this.vHostList;
  }

  private loadVHosts(): IRabbitMq[] {
    this.vHostList = [
      new HomeVhost(this.container, this.config),
    ];
    return this.vHostList;
  }

  start(): Promise<void[]> {
    return Promise.all(
      this.loadVHosts()
        // rise the consumers
        .map(vh => vh.startup()),
    );
  }
}
