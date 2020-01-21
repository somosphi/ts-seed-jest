import * as R from 'ramda';
import { Router, Request, Response, NextFunction } from 'express';

import { Controller } from '../controller';
import { Container } from '../../../container';
import { findUserSchema, createUserSchema } from '../../schemas/v1/user';
import { validatorMiddleware } from '../../middlewares/validator';
import { InternalServerError } from '../../../errors';

import { IContainer } from '../../../types';

export class UserController extends Controller {
  private userService: IContainer['userService'];
  private createTransaction: IContainer['createTransaction'];

  constructor(container: Container) {
    super();
    this.userService = container.userService;
    this.createTransaction = container.createTransaction;
  }

  register(router: Router): void {
    router
      .route('/v1/user')
      .post(
        validatorMiddleware(createUserSchema),
        this.create.bind(this),
      )
      .get(this.list.bind(this));
    router
      .route('/v1/user/:id')
      .get(
        validatorMiddleware(findUserSchema),
        this.find.bind(this),
      );
  }

  /**
   * Creates an user
   * @param req
   * @param res
   * @param next
   */
  async create(req: Request, res: Response, next: NextFunction) {
    const userToCreate = R.pipe(
      R.propOr({}, 'body'),
      R.pick(['name', 'username', 'emailAddress']),
    )(req);

    try {
      let userId = null;
      this.createTransaction(async (trx) => {
        userId = await this.userService.create(userToCreate, trx);

        if (!userId) {
          throw new InternalServerError('Failed to create the user');
        }
      });

      res
        .send({ id: userId })
        .status(201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * List all users
   * @param req
   * @param res
   * @param next
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.all();
      res.send(users);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Find a user by its ID
   * @param req
   * @param res
   * @param next
   */
  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findById(req.params.id);
      res.send(user);
    } catch (err) {
      next(err);
    }
  }
}
