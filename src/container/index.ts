import knex from 'knex';
import { UserModel } from './models/user';
import { UserService } from './services/user';
import { ContainerConfig, ServiceContext } from '../types';

export class Container {
  readonly userService: UserService;

  constructor (config: ContainerConfig) {
    const serviceContext: ServiceContext = {
      userModel: new UserModel(config.mysqlDatabase),
    };

    this.userService = new UserService(serviceContext);
  }
}
