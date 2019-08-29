import { UserModel } from '../models/user';
import { ResourceNotFoundError } from '../../errors';
import { ServiceContext, User } from '../../types';

export class UserService {
  protected readonly userModel: UserModel;

  constructor (context: ServiceContext) {
    this.userModel = context.userModel;
  }

  all(): Promise<User[]> {
    return this.userModel.all();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.getById(id);
    if (!user) {
      throw new ResourceNotFoundError();
    }
    return user;
  }
}
