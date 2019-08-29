import knex from 'knex';

import { UserModel } from '../container/models/user';
import { UserSources } from '../helpers/enums';

export interface AppConfig {
  readonly apmServiceName?: string;
  readonly apmServerUrl?: string;
  readonly httpPort: number;
  readonly httpBodyLimit: string;
}

interface Env {
  readonly apmServiceName?: string;
  readonly apmServerUrl?: string;
  readonly httpPort: number;
  readonly httpBodyLimit: string;
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

export interface ServiceContext {
  userModel: UserModel;
}

export interface ContainerConfig {
  mysqlDatabase: knex;
}

export interface User {
  id: string;
  name: string;
  username: string;
  emailAddress: string;
  source: UserSources;
  createdAt: Date;
  updatedAt: Date;
}
