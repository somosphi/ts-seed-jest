import { Transaction } from 'knex';
import sinon from 'sinon';
import { MySQLModel } from '../mysql';

class TestModel extends MySQLModel<any> {
  static tableName: 'test';

  get table() {
    return super.table;
  }

  getTableName(): string {
    return TestModel.tableName;
  }

  transactionable(trx: Transaction) {
    return super.transactionable(trx);
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
      testModel.table;

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

      const transactionableResult = testModel.transactionable({});

      expect(transactionableResult).toEqual({});
    });

    it('should return default query on send empty trx', () => {
      const databaseQuery = sinon.fake.returns({});

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);

      const transactionableResult = testModel.transactionable();

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

      expect(createdId).toEqual('123');
    });
  });

  describe('#all', () => {
    it('should return database query without filter', async () => {
      const payload = [
        { message: 'Ola mundo' },
      ];

      const databaseQuery = sinon.fake.resolves(payload);

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);
      const result = await testModel.all();

      expect(result).toEqual(payload);
    });
  });
});
