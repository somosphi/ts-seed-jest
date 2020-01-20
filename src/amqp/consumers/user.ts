import * as R from 'ramda';

import { Consumer } from './consumer';
import { Container } from '../../container';
import { findUserSchema, createUserSchema } from '../schemas/user';
import { validatorMiddleware } from '../middlewares/validator';
import { parseMessage } from '../middlewares/parseMessage';

import {
  AmqpChannel, AmqpMessage,
  MsgHandler, AmqpParsedMessage,
} from '../../types';
import { User } from '../../types/User';

export class UserConsumer extends Consumer {
  private userService: Container['userService'];

  constructor({ container }: { container: Container; }) {
    super(container);

    this.userService = container.userService;
  }

  async register(channel: AmqpChannel) {
    channel.consume(
      'tsseed.user.find',
      this.onConsume(
        channel,
        parseMessage<User>(R.__ as unknown as AmqpMessage),
        validatorMiddleware(findUserSchema),
        this.findUser.bind(this) as MsgHandler,
      ),
    );
    channel.consume(
      'tsseed.user.create',
      this.onConsume(
        channel,
        parseMessage<User>(R.__ as unknown as AmqpMessage),
        validatorMiddleware(createUserSchema),
        this.createUser.bind(this) as MsgHandler,
      ),
    );
  }

  async findUser(msg: AmqpParsedMessage<User>): Promise<void> {
    if (!msg) return;

    const content = msg.content;

    const user = await this.userService
      .findById(content.id);

    // send back the user
    return this.userService.sendUserQueue(user);
  }

  async createUser(msg: AmqpParsedMessage<User>): Promise<void> {
    if (!msg) return;

    const content = msg.content;

    const id = await this.userService.create(content);
    const user = await this.userService.findById(id);

    return this.userService.sendUserCreatedNotification(user);
  }

  onConsumeError(err: any, channel: AmqpChannel, msg: AmqpMessage): void { return; }
}
