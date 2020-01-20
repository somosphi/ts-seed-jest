import { assoc, curryN } from 'ramda';

import { AmqpMessage, AmqpParsedMessage } from '../../types';
import { toJSON } from '../../helpers/conversion';

/**
 * Parses the AMQP message to use as object inside the consumers
 * @param msg AMQP Message to parse the content to JSON
 */
export const parseMessage: (<T>(...a: readonly any[]) => any) = curryN(
  1,
  <T extends object>(msg: AmqpMessage): AmqpParsedMessage<T> => {
    return assoc<T, AmqpMessage, 'content'>(
      'content',
      toJSON(msg.content) as T,
      msg,
    );
  },
);
