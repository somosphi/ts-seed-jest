import * as R from 'ramda';

import { MySQLModel } from './mysql';

import { User, IUserModel } from '../../types/User';
import { MySQLTransaction } from '../../types';

export class UserModel extends MySQLModel<User> implements IUserModel {
  getTableName(): string {
    return 'users';
  }

  toDatabase = R.evolve({});
  fromDatabase = R.evolve({}) as (_: Partial<User>) => any;

  all(trx?: MySQLTransaction): Promise<User[]> {
    return this.table(trx)
      .where({})
      .then(R.map(this.fromDatabase));
  }

  async getByEmailsWithSource(
    emails: User['emailAddress'][],
    source: any,
    trx?: MySQLTransaction,
  ): Promise<User[]> {
    return this.table(trx)
      .whereIn('emailAddress', emails)
      .where('source', source);
  }
}
