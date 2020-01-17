import { UserModel } from './models/user';

import { UserService } from './services/user';

import {
  ContainerConfig,
  ServiceContext,
  IContainer,
} from '../types';
import { UserProducer } from './integrations/UserProducer';

export class Container implements IContainer {
  readonly createTransaction: IContainer['createTransaction'];
  readonly userService: IContainer['userService'];

  constructor(config: ContainerConfig) {
    const database = config.mysqlDatabase;

    const serviceContext: ServiceContext = this
      .createServiceContext(database, config.vHostList);

    this.userService = new UserService(serviceContext);

    this.createTransaction = database.transaction.bind(database);
  }

  private createServiceContext = (
    db: ContainerConfig['mysqlDatabase'],
    vhost: ContainerConfig['vHostList'],
  ) => ({
    userModel: new UserModel(db),
    userProducer: new UserProducer({ vhost }),
    // tslint:disable-next-line: semicolon
  });
}
