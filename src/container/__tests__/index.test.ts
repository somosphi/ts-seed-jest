import { Container } from '..';
import { HomeVhost } from '../../amqp/vhost/home';
import { AmqpConfig } from '../../types';

describe('Container', () => {

  describe('#constructor', () => {
    it('should contains public property "userService"', () => {
      const container = new Container({
        // @ts-ignore
        mysqlDatabase: { transaction: jest.fn().mockReturnThis() },
        vHostList: [new HomeVhost({} as AmqpConfig)],
      });
      expect(container.userService).not.toEqual(null);
    });
  });
});
