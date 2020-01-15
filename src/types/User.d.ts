import { MySQLTransaction } from '.';
import { MySQLModel } from '../container/models/mysql';
import { Request, Response, NextFunction } from 'express';

export type User = {
  id: string;
  name: string;
  username: string;
  emailAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface IUserModel extends MySQLModel<User> {
  all(trx?: MySQLTransaction): Promise<User[]>;
}

export interface IUserService {
  all(): Promise<User[]>;
  findById(id: string): Promise<User>;
}

export interface IUserController {
  list(req: Request, res: Response, next: NextFunction): void;
  find(req: Request, res: Response, next: NextFunction): void;
}
