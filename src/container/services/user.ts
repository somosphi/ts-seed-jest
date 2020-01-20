import * as R from 'ramda';

import { BadRequest } from '../../errors';

import { User, IUserModel, IUserProducer } from '../../types/User';
import { ServiceContext, MySQLTransaction } from '../../types';

export class UserService {
  protected readonly userModel: ServiceContext['userModel'];
  private readonly userProducer: ServiceContext['userProducer'];

  constructor(context: ServiceContext) {
    this.userModel = context.userModel;
    this.userProducer = context.userProducer;
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

  sendUserQueue(user: Partial<User>): void {
    return this.userProducer.sendFindUser(
      R.omit(['createdAt', 'updatedAt'], user),
    );
  }

  sendUserCreatedNotification(user: Partial<User>): void {
    return this.userProducer.sendUserCreated(user);
  }
}
