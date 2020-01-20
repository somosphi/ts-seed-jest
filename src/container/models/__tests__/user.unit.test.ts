import { UserModel } from '../user';
import sinon from 'sinon';

import { User } from '../../../types/User';

describe('UserModel', () => {

  describe('#getTableName', () => {
    it('should use table "user"', () => {
      // @ts-ignore
      const userModel = new UserModel();
      expect(userModel.getTableName()).toEqual('user');
    });
  });

  describe('#getByEmailsWithSource', () => {
    it('should call whereIn and where methods without transaction', async () => {
      const payload: User[] = [
        {
          id: '1',
          name: 'Fulano',
          username: 'fulano',
          emailAddress: 'fulano@gmail.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // @ts-ignore
      const userModel = new UserModel(() => ({
        where: jest.fn().mockReturnValue(payload),
        whereIn: jest.fn().mockReturnThis(),
      }));
      const sourceQuery = sinon.fake.resolves(payload);
      const emailsQuery = sinon.fake.returns({ where: sourceQuery });

      userModel.transactionable = sinon.fake.returns({
        whereIn: emailsQuery,
      });

      const emails = ['fulano@gmail.com'];
      const users = await userModel
        .getByEmailsWithSource(emails, 'xx');

      expect(users).toEqual(payload);
    });
  });
});
