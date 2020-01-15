import { BadRequest } from '../../errors';

import { User, IUserService, IUserModel } from '../../types/User';
import { ServiceContext } from '../../types';

export class UserService implements IUserService {
  protected readonly userModel: IUserModel;

  constructor(context: ServiceContext) {
    this.userModel = context.userModel;
  }

  all(): Promise<User[]> {
    return this.userModel.all();
  }

  async findById(id: string): Promise<User> {
    const [user] = await this.userModel.get({
      filters: { id },
    });

    if (!user) {
      throw new BadRequest('User not found');
    }

    return user;
  }
}
