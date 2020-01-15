import { start as ElasticStart } from './helpers/elasticApm';
ElasticStart();

import * as R from 'ramda';

import { Logger as logger } from './logger';
import { env } from './env';
import { Application } from './app';

import { AppConfig } from './types';

const appConfig: AppConfig = R.pick(
  [
    'apmServiceName',
    'apmServiceUrl',
    'httpPort',
    'httpBodyLimit',
    'dbConnector',
  ],
  env,
);

const application = new Application(appConfig);

setImmediate(async () => {
  await application.start();
  logger.info('Application started');
});
