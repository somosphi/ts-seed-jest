import * as R from 'ramda';
import { env } from './env';
import { logger } from './logger';
import { Application } from './app';
import { AppConfig } from './types';

const appConfig: AppConfig = R.pick(
  ['apmServiceName', 'apmServiceUrl', 'httpPort', 'httpBodyLimit'],
  env
);

const application = new Application(appConfig);

setImmediate(async () => {
  await application.start();
  logger.info('Application started');
});
