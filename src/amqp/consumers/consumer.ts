import { Container } from '../../container';
import { Logger } from '../../logger';

import { IConsumer, AmqpMessage, AmqpChannel, MsgHandler } from '../../types';

export abstract class Consumer implements IConsumer {
  protected container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  abstract register(ch: AmqpChannel): Promise<void>;

  abstract onConsumeError(
    err: any,
    channel: AmqpChannel,
    msg: AmqpMessage | null,
  ): void;

  onConsume = (channel: AmqpChannel, msgHandler: MsgHandler): MsgHandler => {
    return async (message: AmqpMessage | null): Promise<void> => {
      try {
        await msgHandler(message);
      } catch (error) {
        this.onConsumeError(error, channel, message);
        Logger.error(error);
      } finally {
        if (message) channel.ack(message);
      }
    };
    // tslint:disable-next-line: semicolon
  };
}
