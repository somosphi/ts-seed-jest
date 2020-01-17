import * as R from 'ramda';
import { v4 as uuid } from 'uuid';

import { MySQLModel } from './mysql';

import { User, IUserModel } from '../../types/User';
import { MySQLTransaction } from '../../types';

export class UserModel extends MySQLModel<User> implements IUserModel {
  getTableName(): string {
    return 'user';
  }

  toDatabase = R.evolve({});
  fromDatabase = R.evolve({}) as (_: Partial<User>) => any;

  all(trx?: MySQLTransaction): Promise<User[]> {
    return this.table(trx)
      .where({})
      .then(R.map(this.fromDatabase));
  }

  create(user: Partial<User>, trx?: MySQLTransaction): Promise<User['id']> {
    const id = uuid();
    return super.create(R.assoc('id', id, user), trx)
      .then(() => id);
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
