import {
  ContainerConfig,
  ServiceContext,
  IContainer,
} from '../types/containers';
import { UserService } from './services/user';
import { UserModel } from './models/user';

export class Container implements IContainer {
  readonly userService: UserService;

  constructor (config: ContainerConfig) {
    const serviceContext: ServiceContext = {
      userModel: new UserModel(config.mysqlDatabase),
    };

    this.userService = new UserService(serviceContext);
  }
}
