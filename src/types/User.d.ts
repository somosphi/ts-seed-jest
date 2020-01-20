import { Request, Response, NextFunction } from 'express';

import { RabbitMQ } from '../amqp/rabbit';
import { MySQLModel } from '../container/models/mysql';

import {
  MySQLTransaction, Exchange, RoutingKey,
  QueueMessage, IRabbitMq, IVhost,
} from '.';

export type User = {
  id: string;
  name: string;
  username: string;
  emailAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface IUserModel extends MySQLModel<User> {
  /**
   * Get all users from the database
   * @param trx Transaction object
   */
  all(trx?: MySQLTransaction): Promise<User[]>;
}

export type UserIntegrationAmqpConfig = {
  vhost: IVhost[];
};

export interface IUserProducer {
  /**
   * Send a notification with the found user
   * @param msg Message
   */
  sendFindUser(msg: Partial<Omit<User, 'createdAt' | 'updatedAt'>>): void;

  /**
   * Send a notification with the created user
   * @param msg Message
   */
  sendUserCreated(msg: Partial<Omit<User, 'createdAt' | 'updatedAt'>>): void;
}
