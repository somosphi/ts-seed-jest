import { Transaction } from 'knex';
import { MySQLModel } from './mysql';
import { User } from '../../types/containers/services/User';

export class UserModel extends MySQLModel<User> {

  getTableName(): string {
    return 'users';
  }

  async getByEmailsWithSource(
    emails: string[], source: any, trx?: Transaction,
  ): Promise<User[]> {
    return await this.transactionable(trx)
      .whereIn('emailAddress', emails)
      .where('source', source);
  }
}
