import sinon from 'sinon';

import { MySQLModel } from '../mysql';

class TestModel extends MySQLModel<any> {
  protected toDatabase(data: Partial<any>): object {
    return {};
  }
  protected fromDatabase(record: object): Partial<any> {
    return {};
  }
  static tableName: 'test';

  getTableName(): string {
    return TestModel.tableName;
  }
}

describe('MySQLModel', () => {

  describe('#getTableName', () => {
    it('should return table name', () => {
      // @ts-ignore
      const testModel = new TestModel();
      expect(testModel.getTableName()).toEqual(TestModel.tableName);
    });
  });

  describe('#table', () => {
    it('should return query with table filter', () => {
      const databaseQuery = sinon.fake.returns({});

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);

      expect(testModel.db).toBeDefined();
    });
  });

  describe('#transactionable', () => {
    it('should return transactionable query on send trx', () => {
      const transactingQuery = sinon.fake.returns({});

      const databaseQuery = sinon.fake.returns({
        transacting: transactingQuery,
      });

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);

      const transactionableResult = testModel.table({});

      expect(transactionableResult).toEqual({});
    });

    it('should return default query on send empty trx', () => {
      const databaseQuery = sinon.fake.returns({});

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);

      const transactionableResult = testModel.table();

      expect(transactionableResult).toEqual({});
    });
  });

  describe('#create', () => {
    it('should return created id parsed to string', async () => {
      const insertQuery = sinon.fake.resolves([123]);

      const databaseQuery = sinon.fake.returns({
        insert: insertQuery,
      });

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);

      const insertData = { message: 'Ola mundo' };
      const createdId = await testModel.create(insertData);

      expect(createdId).toEqual([123]);
    });
  });

  describe('#all', () => {
    it('should return database query without filter', async () => {
      const payload = [
        { message: 'Ola mundo' },
      ];

      // @ts-ignore
      const testModel = new TestModel(() => ({
        where: jest.fn().mockReturnValue(payload),
      }));
      const result = await testModel.get({});

      expect(result).toEqual(payload);
    });
  });
});
