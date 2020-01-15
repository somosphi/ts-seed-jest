import { Container } from '..';

describe('Container', () => {

  describe('#constructor', () => {
    it('should contains public property "userService"', () => {
      const container = new Container({
        // @ts-ignore
        jsonPlaceholderConfig: {},
        // @ts-ignore
        mysqlDatabase: { transaction: jest.fn().mockReturnThis() },
      });
      expect(container.userService).not.toEqual(null);
    });
  });
});
