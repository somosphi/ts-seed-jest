import { assoc, curryN } from 'ramda';

import { AmqpMessage, AmqpParsedMessage } from '../../types';
import { toJSON } from '../../helpers/conversion';

export const parseMessage: (<T>(...a: readonly any[]) => any) = curryN(
  1,
  <T extends object>(msg: AmqpMessage): AmqpParsedMessage<T> => {
    return assoc(
      'content',
      toJSON(msg.content),
      msg,
    ) as AmqpParsedMessage<T>;
  },
);
