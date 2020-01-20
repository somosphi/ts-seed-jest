import { MySQLTransaction, Exchange, RoutingKey, QueueMessage, IRabbitMq } from '.';
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

export interface IUserController {
  list(req: Request, res: Response, next: NextFunction): void;
  find(req: Request, res: Response, next: NextFunction): void;
}

export type UserIntegrationAmqpConfig = {
  vhost: IRabbitMq[];
};

export interface IUserProducer {
  sendFindUser(msg: Partial<Omit<User, 'createdAt' | 'updatedAt'>>): void;
}
