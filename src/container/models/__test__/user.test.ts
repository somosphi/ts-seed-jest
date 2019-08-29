import { UserModel } from '../user';
import sinon from 'sinon';
import { UserSources } from '../../../helpers/enums';
import { User } from '../../../types';

describe('UserModel', () => {

  describe('#getTableName', () => {
    it('should use table "users"', () => {
      // @ts-ignore
      const userModel = new UserModel();
      expect(userModel.getTableName()).toEqual('users');
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
          source: UserSources.JsonPlaceholder,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // @ts-ignore
      const userModel = new UserModel();
      const sourceQuery = sinon.fake.resolves(payload);
      const emailsQuery = sinon.fake.returns({ where: sourceQuery });

      userModel.transactionable = sinon.fake.returns({
        whereIn: emailsQuery,
      });

      const emails = ['fulano@gmail.com'];
      const users = await userModel
        .getByEmailsWithSource(emails, UserSources.JsonPlaceholder);

      expect(users).toEqual(payload);
    });
  });
});
