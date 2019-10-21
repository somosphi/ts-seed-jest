import * as dotenv from 'dotenv';
import { Env } from './types';

dotenv.config();

export const env: Env = {
  apmServiceName: process.env.APM_SERVICE_NAME,
  apmServerUrl: process.env.APM_SERVER_URL,
  httpPort: (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000,
  httpBodyLimit: process.env.BODY_LIMIT || '10kb',
  dbConnector: process.env.DB_CONNECTOR || 'mysql',
  userServiceHelper: process.env.USER_SERVICE_HELPER_URL,
  dbPort: parseInt(process.env.DB_PORT || '3306', 10),
  dbHost: process.env.DB_HOST || '',
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_DATABASE,
  dbPoolMin: parseInt(process.env.DB_POOL_MIN || '1', 10),
  dbPoolMax: parseInt(process.env.DB_POOL_MAX || '1', 10),
  dbDebug: process.env.DB_DEBUG === 'true',
};
