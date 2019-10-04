import knex from 'knex';
import { AppConfig } from '../index';
import { UserModel } from '../../container/models/user';

export interface IContainer {
}

export interface ServiceContext {
  userModel: UserModel;
}

export interface ContainerConfig {
  mysqlDatabase: knex;
}
