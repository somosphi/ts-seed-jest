import knex from 'knex';
import { Router } from 'express';
import { AnySchema } from '@hapi/joi';

import { UserModel } from '../container/models/user';
import { IUserService, IUserModel } from './User';
import { Options } from 'amqplib';

declare global {
  namespace jest {
    // tslint:disable-next-line: interface-name
    interface Matchers<R, T> {
      /**
       * Checks if the object matches the schema
       * @param schema Joi schema
       */
      toMatchSchema(schema: AnySchema): R;
    }
  }
}

export type MySQLTransaction = knex.Transaction;
export type Database = knex;
export type QueryBuilder = knex.QueryBuilder;
export type TransactionScope = (callback: (trx: MySQLTransaction) => Promise<any>) => Promise<any>;

export type Nullable<T> = T | undefined | null;
export type UUID<T> = T;

type Env = {
  readonly httpPort: number;
  readonly httpBodyLimit: string;
  readonly userServiceHelper?: string;
  readonly dbPort: number;
  readonly dbHost: string;
  readonly dbUsername?: string;
  readonly dbPassword?: string;
  readonly dbDatabase?: string;
  readonly dbPoolMin: number;
  readonly dbPoolMax: number;
  readonly dbDebug: boolean;
  readonly rabbitMqHost: string;
  readonly rabbitMqProtocol: string;
  readonly rabbitMqPort: number;
  readonly rabbitMqUsername: string;
  readonly rabbitMqPassword: string;
  readonly rabbitMqReconnectTimeout: number;
};

export type AppConfig =
  Pick<Env, 'httpPort' | 'httpBodyLimit'>;

export type HttpServerConfig = {
  port: Env['httpPort'];
  bodyLimit: Env['httpBodyLimit'];
};

interface ICodedError {
  message: string;
  code: string;
  details?: object;
}

export interface IContainer {
  readonly createTransaction: TransactionScope;
  readonly userService: IUserService;
}

export type ServiceContext = {
  userModel: IUserModel;
};

export type ContainerConfig = {
  mysqlDatabase: knex;
};

export interface IController {
  register(router: Router): void;
}

export type UpdateParams<T> = {
  filters: Partial<{
    [K in keyof T]: T[K];
  }>,
  data: Partial<{
    [K in keyof T]: T[K];
  }>;
};

type AmqpConfig = {
  host: Env['rabbitMqHost'];
  protocol: Env['rabbitMqProtocol'];
  port: Env['rabbitMqPort'];
  username: Env['rabbitMqUsername'];
  password: Env['rabbitMqPassword'];
  reconnectTimeout: Env['rabbitMqReconnectTimeout'];
};

export type AmqpIntegrationConfig = {
  vhost: string;
  config: AmqpConfig;
};

export type Exchange = string;
export type RoutingKey = string;
export type QueueMessage = string;

interface IRabbitMq {
  init(): Promise<void>;
  send(ex: Exchange, rk: RoutingKey, msg: QueueMessage, additional: Options.Publish): void;
}
