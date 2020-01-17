import { Consumer } from './consumer';

import { AmqpChannel, AmqpMessage } from '../../types';

export class UserConsumer extends Consumer {
  constructor({ container, config }: any) {
    super(container);
  }

  async register(channel: AmqpChannel) {
    await channel.consume(
      'user.find',
      this.onConsume(channel, this.findUser.bind(this)),
    );
    await channel.consume(
      'user.create',
      this.onConsume(channel, this.createUser.bind(this)),
    );
  }

  findUser(msg: AmqpMessage | null): void { return; }

  createUser(msg: AmqpMessage | null): void { return; }

  onConsumeError(err: any, channel: AmqpChannel, msg: AmqpMessage): void {
    throw new Error('Method not implemented.');
  }
}
