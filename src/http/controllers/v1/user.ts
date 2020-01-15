import { Router, Request, Response, NextFunction } from 'express';

import { Controller } from '../controller';
import { Container } from '../../../container';
import { findUserSchema } from '../../schemas/v1/user';
import { validatorMiddleware } from '../../middlewares/validator';

import { IContainer } from '../../../types';
import { IUserController } from '../../../types/User';

export class UserController extends Controller implements IUserController {
  protected userService: IContainer['userService'];

  constructor(container: Container) {
    super();
    this.userService = container.userService;
  }

  register(router: Router): void {
    router.get(
      '/v1/users',
      this.list.bind(this),
    );
    router.get(
      '/v1/users/:id',
      validatorMiddleware(findUserSchema),
      this.find.bind(this),
    );
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.all();
      res.send(users);
    } catch (err) {
      next(err);
    }
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findById(req.params.id);
      res.send(user);
    } catch (err) {
      next(err);
    }
  }
}
