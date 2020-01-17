import { MySQLTransaction, Exchange, RoutingKey, QueueMessage } from '.';
import { MySQLModel } from '../container/models/mysql';
import { Request, Response, NextFunction } from 'express';
import { RabbitMQ } from '../amqp/rabbit';

export type User = {
  id: string;
  name: string;
  username: string;
  emailAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface IUserModel extends MySQLModel<User> {
  all(trx?: MySQLTransaction): Promise<User[]>;
}

export interface IUserService {
  all(): Promise<User[]>;
  findById(id: string): Promise<User>;
}

export interface IUserController {
  list(req: Request, res: Response, next: NextFunction): void;
  find(req: Request, res: Response, next: NextFunction): void;
}

export type UserIntegrationAmqpConfig = {
  exchange: Exchange;
  routingKey: RoutingKey;
  vhost: RabbitMQ;
};

export interface IUserProducer {
  send(msg: QueueMessage): void;
}
