import * as dotenv from 'dotenv';
import { Env } from './types';

dotenv.config();

export const env: Env = {
  // HTTP server config
  httpPort: (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000,
  httpBodyLimit: process.env.BODY_LIMIT || '10kb',
  userServiceHelper: process.env.USER_SERVICE_HELPER_URL,

  // Database config
  dbPort: parseInt(process.env.DB_PORT || '3306', 10),
  dbHost: process.env.DB_HOST || '',
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_DATABASE,
  dbPoolMin: parseInt(process.env.DB_POOL_MIN || '1', 10),
  dbPoolMax: parseInt(process.env.DB_POOL_MAX || '1', 10),
  dbDebug: process.env.DB_DEBUG === 'true',

  // RabbitMQ config
  rabbitMqHost: process.env.RABBIT_HOST || 'localhost',
  rabbitMqProtocol: process.env.RABBIT_PROTOCOL || 'amqp',
  rabbitMqPort: parseInt(process.env.RABBIT_PORT || '5672', 10),
  rabbitMqUsername: process.env.RABBIT_USERNAME,
  rabbitMqPassword: process.env.RABBIT_PASSWORD,
  rabbitMqReconnectTimeout: parseInt(process.env.RABBIT_RECONNECT_TIMEOUT || '5000', 10),

  rabbitMqVhostHome: process.env.RABBIT_VHOST_HOME || '',
};
