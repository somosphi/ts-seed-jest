import { BadRequest } from '../../errors';

import { User } from '../../types/User';
import { ServiceContext, MySQLTransaction } from '../../types';

export class UserService {
  protected readonly userModel: ServiceContext['userModel'];

  constructor(context: ServiceContext) {
    this.userModel = context.userModel;
  }

  all(): Promise<User[]> {
    return this.userModel.all();
  }

  create(user: Partial<User>, trx?: MySQLTransaction): Promise<User['id']> {
    return this.userModel.create(user);
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
