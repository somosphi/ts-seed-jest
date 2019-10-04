import knex from 'knex';

import { UserModel } from '../container/models/user';

export interface AppConfig {
  readonly apmServiceName?: string;
  readonly apmServerUrl?: string;
  readonly httpPort: number;
  readonly httpBodyLimit: string;
  readonly dbConnector: string;
}

interface Env {
  readonly apmServiceName?: string;
  readonly apmServerUrl?: string;
  readonly httpPort: number;
  readonly httpBodyLimit: string;
  readonly dbConnector: string;
  readonly userServiceHelper?: string;
}

interface ICodedError {
  message: string;
  code: string;
  details?: object;
}

export interface HttpServerConfig {
  port: number;
  bodyLimit: string;
}
