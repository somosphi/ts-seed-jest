import { Container } from '../container';
import { HomeVhost } from './vhost/home';

import { AmqpServerConfig, IVhost } from '../types';

export class AmqpServer {
  private readonly config: AmqpServerConfig;
  private container: Container | null;
  private vHostList: IVhost[];

  constructor(config: AmqpServerConfig, container?: Container) {
    this.config = config;
    this.container = container || null;
    this.vHostList = [];
  }

  getVHostList(): IVhost[] {
    if (!this.vHostList?.length) {
      this.loadVHosts();
    }
    return this.vHostList;
  }

  private loadVHosts() {
    this.vHostList = [
      new HomeVhost(this.config, this.container!),
    ];
  }

  setContainer(c: Container): void {
    this.container = c;
    this.getVHostList()
      .forEach(vHost => vHost.setContainer(c));
  }

  start(): Promise<void[]> {
    return Promise.all(
      this.getVHostList()
        // rise the consumers
        .map(vh => vh.startup()),
    );
  }
}
