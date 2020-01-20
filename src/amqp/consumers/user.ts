import { Consumer } from './consumer';
import { toJSON } from '../../helpers/conversion';

import { AmqpChannel, AmqpMessage } from '../../types';
import { Container } from '../../container';

export class UserConsumer extends Consumer {
  private userService: Container['userService'];

  constructor({ container, config }: { container: Container; config: any; }) {
    super(container);

    this.userService = container.userService;
  }

  async register(channel: AmqpChannel) {
    await channel.consume(
      'tsseed.user.find',
      this.onConsume(channel, this.findUser.bind(this)),
    );
    await channel.consume(
      'tsseed.user.create',
      this.onConsume(channel, this.createUser.bind(this)),
    );
    await channel.consume(
      'tsseed.user.notify',
      this.onConsume(channel, this.validateUser.bind(this)),
    );
  }

  async findUser(msg: AmqpMessage | null): Promise<void> {
    if (!msg) return;

    const content = toJSON(msg?.content);

    const user = await this.userService
      // @ts-ignore
      .findById(content?.id);

    // send back the user
    return this.userService.sendUserQueue(user);
  }

  async createUser(msg: AmqpMessage | null): Promise<void> {
    if (!msg) return;

    const content = toJSON(msg?.content) as object;

    await this.userService.create(content);
  }

  validateUser(msg: AmqpMessage | null): void {
    console.log('validate user msg', msg);
    console.log('content', toJSON(msg?.content));
    return;
  }

  onConsumeError(err: any, channel: AmqpChannel, msg: AmqpMessage): void {
    console.log('!#@!#!', err);
  }
}
