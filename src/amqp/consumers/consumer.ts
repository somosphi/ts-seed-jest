import { Container } from '../../container';
import { Logger } from '../../logger';

import { IConsumer, AmqpMessage, AmqpChannel, MsgHandler } from '../../types';
import { applyHandlers, FuncHandler } from '../middlewares/handlers';

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

  onConsume = (channel: AmqpChannel, ...msgHandler: FuncHandler[]): MsgHandler => {
    return async (message: AmqpMessage | null): Promise<void> => {
      try {
        const handle = applyHandlers(msgHandler) as MsgHandler;
        await handle(message);
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
