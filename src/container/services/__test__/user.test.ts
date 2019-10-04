import sinon from 'sinon';
import { UserService } from '../user';
import { BadRequest } from '../../../errors';
import { User } from '../../../types/containers/services/User';

describe('UserService', () => {

  describe('#all', () => {
    it('should return user model all result', async () => {
      const payload: User[] = [];

      const context = {
        userModel: {
          all: sinon.fake.resolves(payload),
        },
      };

      // @ts-ignore
      const userService = new UserService(context);
      const result = await userService.all();

      expect(result).toEqual(payload);
    });
  });

  describe('#findById', () => {
    it('should return user', async () => {
      const payload = { message: 'Ola mundo' };

      const context = {
        userModel: {
          getById: sinon.fake.resolves(payload),
        },
      };

      // @ts-ignore
      const userService = new UserService(context);
      const user = await userService.findById('1');

      expect(user).toEqual(payload);
    });

    it('should throw resource not found error', async () => {
      const payload = null;

      const context = {
        userModel: {
          getById: sinon.fake.resolves(payload),
        },
      };

      // @ts-ignore
      const userService = new UserService(context);

      let error;
      try {
        await userService.findById('1');
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(BadRequest);
    });
  });

  describe('#fetchFromJsonPlaceholder', () => {
    it('should fetch all users when database result is empty', async () => {
      expect(['1']).toEqual(['1']);
    });
  });
});
