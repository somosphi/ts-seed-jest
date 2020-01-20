import knex from 'knex';
import { Router } from 'express';
import { AnySchema } from '@hapi/joi';
import { Options, ConsumeMessage, Channel, Connection } from 'amqplib';

import { UserModel } from '../container/models/user';
import { UserService } from '../container/services/user';
import { Container } from '../container';

import { IUserModel, IUserProducer } from './User';

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
  readonly rabbitMqHost?: string;
  readonly rabbitMqProtocol?: string;
  readonly rabbitMqPort: number;
  readonly rabbitMqUsername?: string;
  readonly rabbitMqPassword?: string;
  readonly rabbitMqReconnectTimeout?: number;
  readonly rabbitMqVhostHome: string;
};

export type AppConfig =
  Pick<
    Env,
    'httpPort' |
    'httpBodyLimit' |
    'rabbitMqHost' |
    'rabbitMqProtocol' |
    'rabbitMqPort' |
    'rabbitMqUsername' |
    'rabbitMqPassword' |
    'rabbitMqReconnectTimeout' |
    'rabbitMqVhostHome'
  >;

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
  readonly userService: UserService;
}

export type ServiceContext = {
  userModel: IUserModel;
  userProducer: IUserProducer;
};

export type ContainerConfig = {
  mysqlDatabase: knex;
  vHostList: IVhost[];
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
  vhostHome: Env['rabbitMqVhostHome'];
};

export type AmqpParsedMessage<T> = {
  fields: AmqpMessage['fields'];
  properties: AmqpMessage['properties'];
  content: T;
};

export type AmqpIntegrationConfig = {
  vhost: string;
  config: AmqpConfig;
};

export type Exchange = string;
export type RoutingKey = string;
export type QueueMessage = string;
export type QueueName = string;
export type AmqpChannel = Channel;
export type AmqpConnection = Connection;
export type AmqpMessage = ConsumeMessage;
export type AmqpServerConfig = AmqpConfig;
export type AmqpPublishOptions = Options.Publish;

interface IRabbitMq {
  /**
   * The vHost name
   */
  vHostName: string;

  /**
   * Starts the RabbitMQ
   */
  startup(): Promise<void>;

  /**
   * Start all consumers
   */
  startConsumers(): Promise<void | void[]>;

  /**
   * Connects the service to RabbitMQ
   */
  init(): Promise<void>;

  /**
   * Sends a message to the configured exchange
   * @param ex Exchange
   * @param rk Routing Key
   * @param msg Message to send
   * @param additional Additional properties to use when publish
   */
  send(ex: Exchange, rk: RoutingKey, msg: object, additional: Options.Publish): void;
}

export interface IVhost extends IRabbitMq {
  /**
   * Set the container
   * @param c Container to use in the server
   */
  setContainer(c: Container): void;
}

export type MsgHandler = (msg: AmqpMessage | null) => void | Promise<void>;

export interface IConsumer {
  /**
   * Handles the error when receiving a message
   * @param err Error
   * @param channel Channel
   * @param msg Message to consume
   */
  onConsumeError(err: any, channel: AmqpChannel, msg: AmqpMessage | null): void;

  /**
   * Consumes a message
   * @param channel Channle
   */
  onConsume(
    channel: Channel,
    msgHandler: MsgHandler,
  ): (message: ConsumeMessage | null) => void | Promise<void>;

  /**
   * Register a consumer in the channel
   * @param ch AMQP channel
   */
  register(ch: AmqpChannel): Promise<void>;
}

export type ProducerQueueConfig = {
  [K: string]: {
    exchange: Exchange;
    routingKey: RoutingKey;
    pubOpts?: AmqpPublishOptions;
  };
};
