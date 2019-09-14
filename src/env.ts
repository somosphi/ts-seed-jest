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
};
