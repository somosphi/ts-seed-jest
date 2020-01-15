import { AmqpIntegrationConfig } from '../../types';

export abstract class AmqpIntegration {
  protected vhost: string;
  protected config: AmqpIntegrationConfig['config'];

  constructor({ vhost, config }: AmqpIntegrationConfig) {
    this.vhost = vhost;
    this.config = config;
  }
}
