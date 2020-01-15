import { QueryBuilder } from 'knex';

import { MySQLTransaction, UpdateParams } from '../../types';

export abstract class Model<T> {
  abstract getTableName(): string;

  protected abstract toDatabase(data: Partial<T>): object;

  protected abstract fromDatabase(record: object): Partial<T>;

  protected abstract table(trx?: MySQLTransaction): QueryBuilder;

  protected abstract create(
    data: Partial<T>,
    trx?: MySQLTransaction,
  ): Promise<any>;

  protected abstract get(
    params: Pick<UpdateParams<T>, 'filters'>,
    trx?: MySQLTransaction,
  ): Promise<T[]>;

  protected abstract update(
    params: UpdateParams<T>,
    trx?: MySQLTransaction,
  ): Promise<boolean>;

  protected abstract del(
    params: Pick<UpdateParams<T>, 'filters'>,
    trx?: MySQLTransaction,
  ): Promise<boolean>;
}
