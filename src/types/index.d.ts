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
  readonly dbPort: number;
  readonly dbHost: string;
  readonly dbUsername?: string;
  readonly dbPassword?: string;
  readonly dbDatabase?: string;
  readonly dbPoolMin: number;
  readonly dbPoolMax: number;
  readonly dbDebug: boolean;
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
