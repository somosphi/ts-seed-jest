import * as R from 'ramda';
import { AmqpMessage, MsgHandler } from '../../types';

type FuncHandler = ((_: AmqpMessage) => AmqpMessage) | MsgHandler;

export const applyHandlers: (handlers: FuncHandler[]) =>
  ReturnType<FuncHandler> | MsgHandler = R.tryCatch(
    R.ifElse(
      l => R.gte(R.length(l), 1),
      // @ts-ignore
      l => R.pipe(...l),
      () => { throw new Error('Invalid list of handlers'); },
    ),
    R.tap(console.log.bind(null, 'Error:')),
  );
