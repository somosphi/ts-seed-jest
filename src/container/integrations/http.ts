import R from 'ramda';
import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { Random } from 'random-js';
import { logger } from '../../logger';
import moment = require('moment');

const random = new Random();

const logRequest = R.curryN(
  2,
  (requestId: string, config: AxiosRequestConfig) => {
    const pickData: string[] = ['headers', 'method', 'url', 'data', 'params'];

    logger.info(JSON.stringify({
      timestamp: moment.utc().format(),
      origin: 'Axios',
      type: 'Request',
      requestId,
      level: 'info',
      data: R.pipe(
        R.clone,
        R.pick(pickData),
      )(config as readonly unknown[]),
    }));

    return config;
  },
);

const logResponse = R.curryN(
  2,
  (requestId: string, response: AxiosResponse) => {
    const picks: string[] = ['headers', 'data', 'status', 'statusText'];
    const __data__ = R.pick(picks, response);

    logger.info(JSON.stringify({
      timestamp: moment.utc().format(),
      origin: 'Axios',
      type: 'Response',
      requestId,
      level: 'info',
      ...__data__,
    }));

    return response;
  }
);

const logError = R.curryN(
  2,
  (requestId: string, error: any) => {
    const pick: string[] = ['message', 'stack'];
    const __data__ = R.mergeDeepLeft(
      R.pick(pick, error),
      R.path(['response', 'data'], error),
    );

    logger.info(JSON.stringify({
      timestamp: moment.utc().format(),
      origin: 'Axios',
      type: 'Error',
      requestId,
      level: 'error',
      ...__data__,
    }));

    return Promise.reject(error);
  }
);

export abstract class HttpIntegration {
  protected instance: AxiosInstance;

  constructor (options: AxiosRequestConfig) {
    this.instance = axios.create(options);
  }

  private setRequestLogger() {
    const requestId: string = random.uuid4();

    this.instance.interceptors.request.use(
      logRequest(requestId), logError(requestId),
    );

    this.instance.interceptors.response.use(
      logResponse(requestId), logError(requestId),
    );
  }
}
