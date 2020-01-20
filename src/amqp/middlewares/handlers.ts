import * as R from 'ramda';
import { AmqpMessage, MsgHandler } from '../../types';
import { Logger } from '../../logger';

export type FuncHandler = ((_: AmqpMessage) => AmqpMessage) | MsgHandler;

/**
 * Creates a function to execute a list of handlers
 * @param handlers List of functions to be executed
 */
export const applyHandlers: (handlers: FuncHandler[]) =>
  ReturnType<FuncHandler> | MsgHandler = R.tryCatch(
    R.ifElse(
      // verify if the list of handlers has at least one handler
      l => R.gte(R.length(l), 1),
      // creates a pipe with all handlers
      // @ts-ignore
      l => R.pipe(...l),
      () => { throw new Error('Invalid number of handlers'); },
    ),
    // catch the execution error
    R.tap(e => Logger.error(`Error: ${e}`)),
  );
