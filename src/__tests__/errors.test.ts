import sinon from 'sinon';
import * as errors from '../errors';

describe('CodedError', () => {

  class TestCodedError extends errors.CustomError {
    constructor(message: string, details?: any[]) {
      super('TEST', message, details);
    }
  }

  it('should set property code and call toJSON on use JSON.stringify', () => {
    const error = new TestCodedError('Error test');
    const fakeToJSON = sinon.fake.returns(error.toJSON());
    error.toJSON = fakeToJSON;
    JSON.stringify(error);
    expect(error.code).toEqual('TEST');
    expect(error.message).toEqual('Error test');
  });
});

describe('DetailedCodedError', () => {

  // tslint:disable-next-line: max-classes-per-file
  class TestDetailedCodedError extends errors.CustomError {
    constructor(message: string, details?: any[]) {
      super('TEST', message, details);
    }
  }

  it('should set property code and call toJSON on use JSON.stringify', () => {
    const error = new TestDetailedCodedError('Error test', [{ message: 'Ola mundo' }]);
    const fakeToJSON = sinon.fake.returns(error.toJSON());
    error.toJSON = fakeToJSON;
    JSON.stringify(error);
    expect(error.code).toEqual('TEST');
    expect(error.message).toEqual('Error test');
    expect(error.details).toEqual([{ message: 'Ola mundo' }]);
  });
});
