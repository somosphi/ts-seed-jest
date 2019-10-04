import { UserModel } from '../models/user';
import { BadRequest } from '../../errors';
import { User } from '../../types/containers/services/User';
import { ServiceContext } from '../../types/containers';

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
      throw new BadRequest('User not found');
    }
    return user;
  }
}
