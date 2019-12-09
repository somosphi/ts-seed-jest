jest.mock('../../../middlewares/errorHandler');

import * as Knex from 'knex';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { UserController } from '../user';
import { Container } from '../../../../container';
import { errorHandlerMiddleware } from '../../../middlewares/errorHandler';
import database from '../../../../helpers/database';

describe('User controller', () => {
  const container = new Container({
    mysqlDatabase: database() as Knex<any, any[]>,
  });
  const controller = new UserController(container);

  it('Should', async () => {
    const req = new Request();
    const res = new Response();

    // @ts-ignore
    await controller.find(req, res, errorHandlerMiddleware(req, res));
  });
});
