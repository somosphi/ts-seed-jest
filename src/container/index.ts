import { UserModel } from './models/user';

import { UserService } from './services/user';

import {
  ContainerConfig,
  ServiceContext,
  IContainer,
  Database,
} from '../types';

export class Container implements IContainer {
  readonly createTransaction: IContainer['createTransaction'];
  readonly userService: IContainer['userService'];

  constructor(config: ContainerConfig) {
    const database = config.mysqlDatabase;

    const serviceContext: ServiceContext = this.createServiceContext(database);

    this.userService = new UserService(serviceContext);

    this.createTransaction = database.transaction.bind(database);
  }

  private createServiceContext = (db: Database) => ({
    userModel: new UserModel(db),
    // tslint:disable-next-line: semicolon
  });
}
