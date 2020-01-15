import * as R from 'ramda';
import { Model } from './model';

import {
  MySQLTransaction,
  Database,
  QueryBuilder,
  UpdateParams,
} from '../../types';

export abstract class MySQLModel<T> extends Model<T> {
  protected readonly database: Database;

  constructor(database: Database) {
    super();
    this.database = database;
  }

  /**
   * Gets an instance of the database connection with the right schema
   */
  get db() {
    return this.database(this.getTableName());
  }

  /**
   * Creates a raw sql to use in a query
   * @param args Arguments to create the raw sql
   */
  raw(...args: any) {
    return this.database.raw(args);
  }

  /**
   * Format a object to use inside the database
   * @param data Object to be formatted to the database format
   */
  protected abstract toDatabase(data: Partial<T>): object;

  /**
   * Format a record from the database to the format used inside the API service
   * @param record Transform a record from the database to be used inside the API service
   */
  protected abstract fromDatabase(record: object): Partial<T>;

  /**
   * Get database connection with the right schema, using or not a transaction
   * @param trx Transaction object
   */
  protected table(trx?: MySQLTransaction): QueryBuilder {
    const table = this.db;
    return trx ? table.transacting(trx) : table;
  }

  /**
   * Insert the data in the database
   * @param data Data to insert in the database
   * @param trx Transaction object
   */
  async create(data: Partial<T>, trx?: MySQLTransaction): Promise<any> {
    return this.table(trx)
      .insert(this.toDatabase(data));
  }

  /**
   * Selects some information from the database
   * @param params.filters Filters for the select
   * @param trx Transaction object
   */
  async get(
    params: Pick<UpdateParams<T>, 'filters'>,
    trx?: MySQLTransaction,
  ): Promise<T[]> {
    return this.table(trx)
      .where(this.toDatabase(params.filters));
  }

  /**
   * Updates the database with the given filters and data
   * @param params.filters Filters for the update
   * @param params.data Data to be used in the update
   * @param trx Transaction object
   */
  async update(params: UpdateParams<T>, trx?: MySQLTransaction): Promise<boolean> {
    return this.table(trx)
      .where(this.toDatabase(params.filters))
      .update(this.toDatabase(params.data));
  }

  /**
   * Delete a value from the database with the provided key
   * @param params.filters The filters for the deletion
   * @param trx Mysql Transaction object
   */
  async del(
    params: Pick<UpdateParams<T>, 'filters'>,
    trx?: MySQLTransaction,
  ): Promise<boolean> {
    const __filters__ = R.prop('filters', params);

    if (R.isEmpty(__filters__)) {
      return Promise.resolve(false);
    }

    return this.table(trx)
      .where(this.toDatabase(__filters__))
      .del();
  }
}
