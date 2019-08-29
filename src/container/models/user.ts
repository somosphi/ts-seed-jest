import { Transaction } from 'knex';
import { MySQLModel } from './mysql';
import { UserSources } from '../../helpers/enums';
import { User } from '../../types';

export class UserModel extends MySQLModel<User> {

  getTableName(): string {
    return 'users';
  }

  async getByEmailsWithSource(
    emails: string[], source: UserSources, trx?: Transaction,
  ): Promise<User[]> {
    return await this.transactionable(trx)
      .whereIn('emailAddress', emails)
      .where('source', source);
  }
}
