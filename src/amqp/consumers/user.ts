import * as R from 'ramda';
import joi from '@hapi/joi';

import { Consumer } from './consumer';
import { Container } from '../../container';
import { applyHandlers } from '../middlewares/next';

import { findUserSchema } from '../../http/schemas/v1/user';

import { AmqpChannel, AmqpMessage, MsgHandler, AmqpParsedMessage } from '../../types';
import { validatorMiddleware } from '../middlewares/validator';
import { parseMessage } from '../middlewares/parseMessage';
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
        applyHandlers([
          parseMessage<User>(R.__ as unknown as AmqpMessage),
          validatorMiddleware(findUserSchema),
          this.findUser.bind(this),
        ]) as MsgHandler,
      ),
    );
    channel.consume(
      'tsseed.user.create',
      this.onConsume(
        channel,
        applyHandlers([
          parseMessage<User>(R.__ as unknown as AmqpMessage),
          validatorMiddleware(joi.object({})),
          this.createUser.bind(this),
        ]) as MsgHandler,
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

    const i = await this.userService.create(content);
    console.log('###@##', i);
  }

  onConsumeError(err: any, channel: AmqpChannel, msg: AmqpMessage): void {
    console.log('!#@!#!', err);
  }
}
