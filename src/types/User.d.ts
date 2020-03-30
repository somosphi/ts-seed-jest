import { MySQLModel } from '../container/models/mysql';

import {
  MySQLTransaction,
} from '.';

export type User = {
  id: string;
  name: string;
  username: string;
  emailAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface IUserModel extends MySQLModel<User> {
  /**
   * Get all users from the database
   * @param trx Transaction object
   */
  all(trx?: MySQLTransaction): Promise<User[]>;
}
