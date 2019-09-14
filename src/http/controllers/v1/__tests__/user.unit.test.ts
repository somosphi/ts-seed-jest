jest.mock('../../middlewares/errorHandler');

import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { Container } from '../../../container';
import database from '../../../helpers/database';
import { UserController } from '../user';
import { errorHandlerMiddleware } from '../../middlewares/errorHandler';

describe('User controller', () => {
  const container = new Container({
    mysqlDatabase: database,
  });
  const controller = new UserController(container);

  it('Should', async () => {
    const req = new Request();
    const res = new Response();

    // @ts-ignore
    await controller.find(req, res, errorHandlerMiddleware(req, res));
  });
});
